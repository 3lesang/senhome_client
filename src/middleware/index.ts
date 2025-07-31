import { defineMiddleware } from "astro/middleware";

export const onRequest = defineMiddleware(async ({}: any, next: () => any) => {
  return await next();
});
