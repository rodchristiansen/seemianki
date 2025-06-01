import { type NextApiRequest, type NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { db } from "./db";

export const createContext = (opts: CreateNextContextOptions) => {
  return {
    db,
    req: opts.req,
    res: opts.res,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;