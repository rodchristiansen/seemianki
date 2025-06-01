import { initTRPC } from "@trpc/server";
import { type Context, createContext } from "./context";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";

export const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const appRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return { greeting: `Hello ${input?.text ?? "world"}` };
    }),
});

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
});