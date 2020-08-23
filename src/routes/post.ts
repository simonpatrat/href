import { Router, Route } from "../Router/index";
import { callApi } from "../api";
import { renderPage } from "../page";

export const postRoute = {
  path: "/post/:slug",
  exact: true,
  callback: async (path: string, route: Route, router: Router) => {
    const getData = async () => {
      let response = await callApi(path);
      return response;
    };

    await renderPage({
      pageName: "post/slug",
      getData,
      router,
    });
  },
  id: "post",
};
