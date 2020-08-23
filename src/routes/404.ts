import { Route, Router } from "../Router/index";
import { renderPage } from "../page";

export const route404 = {
  path: "/404",
  exact: true,
  callback: async (path: string, route: Route, router: Router) => {
    await renderPage({ pageName: "404", router });
  },
  id: "404",
};
