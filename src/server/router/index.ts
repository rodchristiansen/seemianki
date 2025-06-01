import { router } from "../trpc";
import { reportRouter } from "./report";
import { dashboardRouter } from "./dashboard";

export const appRouter = router({
  report: reportRouter,
  dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;