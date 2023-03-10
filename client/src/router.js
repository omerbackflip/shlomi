import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "hash",
  routes: [
    {
      path: "/",
      name: "ticket-list",
      component: () => import("./components/TicketsList")
    },
    {
      path: "/customers",
      name: "customerList",
      component: () => import("./components/CustomersList")
    },
    {
      path: "/tables",
      name: "table-list",
      component: () => import("./components/TableList")
    },
    {
      path: "/import",
      name: "import-data",
      component: () => import("./components/ImportCSV")
    },
  ]
});