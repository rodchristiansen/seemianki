import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { db as prisma } from "../db"; // Changed import
import { router, publicProcedure } from "../trpc";

// Define Context type (you may need to adjust this based on your actual context)
type Context = {
  // Add your context properties here
};

const t = initTRPC.context<Context>().create();

export const reportRouter = t.router({
  // Existing ingest endpoint
  ingest: t.procedure
    .input(
      z.object({
        serial: z.string(),
        module: z.string(),
        version: z.string(),
        payload: z.record(z.any()),
      }),
    )
    .mutation(async ({ input }) => {
      const { serial, module, version, payload } = input;

      const [device] = await prisma.$transaction([
        prisma.device.upsert({
          where: { serial },
          update: { lastCheckIn: new Date() },
          create: { serial, hostname: serial, platform: "unknown", lastCheckIn: new Date() },
        }),
      ]);

      const mod = await prisma.module.upsert({
        where: { name: module },
        update: { version },
        create: { name: module, version },
      });

      await prisma.report.create({
        data: { deviceId: device.id, moduleId: mod.id, payload },
      });

      return { ok: true };
    }),

  // New Windows-specific ingest endpoint
  windows: t.procedure
    .input(
      z.object({
        serial: z.string(),
        hostname: z.string(),
        events: z.array(
          z.object({
            time: z.string().datetime(),
            level: z.enum(["info", "warn", "error"]),
            message: z.string(),
          }),
        ),
        installs: z.array(
          z.object({
            name: z.string(),
            version: z.string(),
            action: z.string(),
            result: z.string(),
          }),
        ),
        status: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const run = await prisma.windowsRun.create({
        data: {
          serial: input.serial,
          hostname: input.hostname,
          status: input.status ?? "ok",
          events: {
            createMany: { 
              data: input.events.map(event => ({
                time: new Date(event.time),
                level: event.level,
                message: event.message,
              }))
            },
          },
          installs: {
            createMany: { data: input.installs },
          },
        },
      });
      return { id: run.id };
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.user.findMany();
  }),
  
  create: publicProcedure
    .input(z.object({
      name: z.string().optional(),
      email: z.string().email(),
    }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.user.create({
        data: input,
      });
    }),
});
