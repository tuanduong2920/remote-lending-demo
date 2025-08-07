import { createApp, type App } from "vue";
import AppComponent from "./App.vue";
import { initRouter, appRoutes, lendingRoutes } from "./router";
import "./index.css";
import Lending from "./views/Lending.vue";

// Trong library mode, CSS được extract ra file riêng (style.css)
// import "./index.css" = CSS được process & bundle, nhưng extract ra file riêng
// Function này tự động inject CSS file đó vào DOM
const injectCSS = () => {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    const existingLink = document.querySelector('link[href*="style.css"]');
    if (!existingLink) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "./lib/style.css";
      document.head.appendChild(link);
    }
  }
};

// Auto inject CSS khi import library
injectCSS();

let appInstance: App<Element> | null = null;

const mount = (
  el: HTMLElement | string,
  baseUrl: string | undefined = undefined
) => {
  appInstance = createApp(AppComponent);
  appInstance.use(initRouter(appRoutes, baseUrl));
  appInstance.mount(el);

  return {
    unmount: () => {
      appInstance?.unmount();
      appInstance = null;
    },
  };
};

const mountLendingModule = (
  el: HTMLElement | string,
  baseUrl: string | undefined = undefined
) => {
  appInstance = createApp(Lending);
  appInstance.use(initRouter(lendingRoutes, baseUrl));
  appInstance.mount(el);
};
export { mount, mountLendingModule };
