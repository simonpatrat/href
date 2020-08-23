import { renderPage } from "../page";
import { Router, Route } from "../Router/index";

export const aboutRoute = {
  path: "/about",
  exact: true,
  callback: async (path: string, route: Route, router: Router) => {
    await renderPage({ pageName: "about", router });
  },
  id: "about",
};
