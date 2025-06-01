import { describe, test, expect } from "vitest";
import { appRouter } from "../src/server/router";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

describe("report.ingest", () => {
  test("ingest inserts report", async () => {
    const caller = appRouter.createCaller({ prisma });
    await caller.report.ingest({
      serial: "AUTO-001",
      module: "hardware",
      version: "2.0.0",
      payload: { cpu: "M3", ram: 16 },
    });

    const row = await prisma.report.findFirst({
      where: { device: { serial: "AUTO-001" } },
    });
    expect(row).not.toBeNull();
  });
});
