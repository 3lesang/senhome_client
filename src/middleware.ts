import { defineMiddleware } from "astro:middleware";
import { pb } from "./lib/pocketbase";

export const onRequest = defineMiddleware(async (context, next) => {
  const cookie = context.request?.headers.get("cookie");
  pb.authStore.loadFromCookie(cookie || "");
  return next();
});
