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
      name: "customers-list",
      component: () => import("./components/CustomersList")
    },
    // {
    //   path: "/customers2",
    //   name: "customers-list2",
    //   component: () => import("./components/CustomersList2")
    // },
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
    {
      path: "/phones",
      name: "phone-list",
      component: () => import("./components/PhoneList")
    },
    {
      path: "/payments",
      name: "payment-list",
      component: () => import("./components/PaymentsList")
    },
  ]
});