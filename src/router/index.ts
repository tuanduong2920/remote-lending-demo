import {
  createRouter,
  createWebHistory,
  RouterView,
  type RouteRecordRaw,
} from "vue-router";
import Home from "../views/Home.vue";
import Detail from "../views/Detail.vue";
import Lending from "../views/Lending.vue";
import LendingInit from "../views/LendingInit.vue";
import LendingComplete from "../views/LendingComplete.vue";

const lendingRoutes = [
  {
    path: "",
    name: "Lending",
    component: Lending,
    children: [
      {
        path: "init",
        name: "LendingInit",
        component: LendingInit,
      },
      {
        path: "complete",
        name: "LendingComplete",
        component: LendingComplete,
      },
    ],
  },
];

const appRoutes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/detail/:cityId",
    name: "Detail",
    component: Detail,
    props: true,
  },
  {
    path: "/lending",
    name: "AppLending",
    component: RouterView,
    children: lendingRoutes,
  },
];

const initRouter = (
  routes: RouteRecordRaw[] = appRoutes,
  baseUrl: string | undefined = undefined
) =>
  createRouter({
    history: createWebHistory(baseUrl),
    routes,
  });

export { initRouter, appRoutes, lendingRoutes };
