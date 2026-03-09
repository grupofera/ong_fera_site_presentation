import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { animalsRouter } from "./routers/animals";
import { adoptionsRouter } from "./routers/adoptions";
import { donationsRouter } from "./routers/donations";
import { volunteersRouter } from "./routers/volunteers";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  animals: animalsRouter,
  adoptions: adoptionsRouter,
  donations: donationsRouter,
  volunteers: volunteersRouter,
});

export type AppRouter = typeof appRouter;

// TODO: Add more routers as features grow
