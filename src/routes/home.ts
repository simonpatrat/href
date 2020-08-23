import { Route, Router } from "../Router/index";
import { renderPage } from "../page";

export const homeRoute = {
  path: "/",
  exact: true,
  callback: async (path: string, route: Route, router: Router) => {
    await renderPage({ pageName: "home", router });
  },
  id: "home",
};
