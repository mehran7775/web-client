import { useUser } from "@/composables";

//TODO How to move it to the config
const publicPages = [
  /^\/login\/?/,
  /^\/registration/,
  /^\/reset-password/,
  /^\/about-us([#].*)?$/,
  /^\/blog.*\/?([#].*)?$/,
  /^\/?([#].*)?$/,
];

export function needLogin(path: string): boolean {
  return (
    publicPages.findIndex((item) => {
      return item.test(path);
    }) == -1
  );
}

export default defineNuxtPlugin(({ $pinia }) => {
  addRouteMiddleware(
    "auth",
    (to, from) => {
      const userManager = useUser($pinia);
      if (needLogin(to.path) && !userManager.isLogin) {
        return navigateTo("/login", { redirectCode: 401 });
      }
    },
    { global: true }
  );
});
