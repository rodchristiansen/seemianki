import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { db as prisma } from "../db"; // Changed import
import { router, publicProcedure } from "../trpc";

// Define Context type (you may need to adjust this based on your actual context)
type Context = {
  // Add your context properties here
};

const t = initTRPC.context<Context>().create();

export const dashboardRouter = t.router({
  // Existing devices query
  devices: t.procedure.query(async ({ ctx }) => { // Added ctx for consistency if needed, though prisma here is global-like
    return prisma.device.findMany({
      orderBy: { lastCheckIn: "desc" },
      take: 100,
      select: {
        id: true,
        serial: true,
        hostname: true,
        platform: true,
        lastCheckIn: true,
      },
    });
  }),

  // New Windows runs query
  runs: t.procedure.query(async ({ ctx }) => { // Added ctx for consistency
    return prisma.windowsRun.findMany({
      orderBy: { lastSeen: "desc" },
      take: 50,
      select: {
        id: true,
        serial: true,
        hostname: true,
        lastSeen: true,
        status: true,
        _count: {
          select: {
            events: true,
            installs: true,
          },
        },
      },
    });
  }),

  // Events for a specific run
  events: t.procedure
    .input(z.object({ runId: z.string() }))
    .query(async ({ input, ctx }) => { // Added ctx for consistency
      return prisma.event.findMany({
        where: { runId: input.runId },
        orderBy: { time: "desc" },
        select: {
          id: true,
          time: true,
          level: true,
          message: true,
        },
      });
    }),

  // Managed installs for a specific run
  installs: t.procedure
    .input(z.object({ runId: z.string() }))
    .query(async ({ input, ctx }) => { // Added ctx for consistency
      return prisma.managedInstall.findMany({
        where: { runId: input.runId },
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          version: true,
          action: true,
          result: true,
        },
      });
    }),

  getStats: publicProcedure.query(async ({ ctx }) => {
    const userCount = await ctx.db.user.count();
    const devices = await ctx.db.device.findMany({
      orderBy: { lastCheckIn: "desc" },
      take: 100,
      select: {
        id: true,
        serial: true,
        hostname: true,
        platform: true,
        lastCheckIn: true,
      },
    });
    return {
      totalUsers: userCount,
      lastUpdated: new Date(),
      devices: devices, // Added devices
    };
  }),
});
