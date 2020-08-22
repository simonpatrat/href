import { Router } from "./Router/index";
import { routes } from "./routes";
import { hackLinks } from "./links";

const router = new Router({
  routes,
  domElement: document.body,
}).init();

hackLinks(router);
