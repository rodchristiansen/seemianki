import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../src/server/router";

const client = createTRPCProxyClient<AppRouter>({
  links: [httpBatchLink({ url: "http://localhost:3000/api/trpc" })],
});

await client.report.ingest.mutate({
  serial: "TEST-001",
  module: "disk",
  version: "1.0.0",
  payload: { free: 123, total: 512 },
});

console.log("OK");
process.exit(0);
