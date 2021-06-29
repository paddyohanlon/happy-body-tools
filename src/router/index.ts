import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import Measurements from "../views/Measurements.vue";
import Profile from "../views/Profile.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/measurements",
    name: "measurements",
    component: Measurements,
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile,
  },
  {
    path: "/",
    name: "home",
    component: Home,
  },
];

const router = new VueRouter({
  routes,
  linkExactActiveClass: "is-active",
});

export default router;
