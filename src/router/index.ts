import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import Measurements from "../views/Measurements.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/measurements",
    name: "measurements",
    component: Measurements,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
