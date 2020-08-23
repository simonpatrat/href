import { clearSlashes } from "./lib/clearSlashes";

export type Route = {
  id: string;
  path: string;
  callback: (requestedpath: string, route: Route, router: Router) => void;
  params?: { [key: string]: any };
  exact?: boolean;
};

export type RouterParams = {
  route: Route;
};

export interface RouterProps {
  routes: Route[];
  domElement?: HTMLElement;
  beforeNavigate?: (router: Router) => any | undefined;
  afterNavigate?: (router: Router) => any | undefined;
  options?: { [key: string]: any };
}

export interface RouterState {
  loading: boolean;
  [key: string]: any;
}

export class Router {
  routes: Route[] = [
    {
      path: "/404",
      callback: async (requestedpath, route) => {
        await console.error(
          "Error 404 -> ",
          requestedpath,
          " The requested page does not exist"
        );
      },
      exact: true,
      id: "404",
    },
  ];
  state: RouterState = {
    loading: false,
  };
  defaults: { root: string } = {
    root: "/",
  };

  beforeNavigate?: (router: Router) => any | undefined;
  afterNavigate?: (router: Router) => any | undefined;

  domElement: HTMLElement | null | undefined = null;

  settings: { root: string } = this.defaults;

  constructor({
    routes,
    domElement,
    beforeNavigate = undefined,
    afterNavigate = undefined,
    options = {},
  }: RouterProps) {
    this.settings = {
      ...this.defaults,
      ...options,
    };
    this.routes = routes.some((r) => r.id === "404")
      ? (this.routes = routes)
      : [...this.routes, ...routes];
    this.domElement = domElement;

    this.beforeNavigate = beforeNavigate;
    this.afterNavigate = afterNavigate;
  }

  init = (): Router => {
    // window.__ROUTER__ = this;
    this.navigate(decodeURI(window.location.pathname + window.location.search));
    window.addEventListener("popstate", () => {
      this.navigate(
        decodeURI(window.location.pathname + window.location.search)
      );
    });

    return this;
  };

  getRoutes = () => this.routes;

  navigate: (path: string) => Promise<Router> = async (path) => {
    if (this.beforeNavigate) {
      await this.beforeNavigate(this);
    }
    let requestedRoute = this.routes.find((r) => {
      if (r.path !== "/") {
        const routeMatcher = new RegExp(
          r.path.replace(/:[^\s/]+/g, "([\\w-]+)")
        );
        const match = path.match(routeMatcher);
        if (match) {
          return true;
        }
      }
      return r.path === path;
    });

    let route = requestedRoute || this.routes.find((r) => r.id === "404");

    if (path === "404" || path === "/404") {
      route = this.routes.find((r) => r.id === "404");
    }

    await this.setState({
      loading: true,
    });
    const newState = await this.setState({
      currentRoute: route,
      loading: false,
    });
    if (route && route.callback) {
      await route.callback(path, route, this);
      window.history.pushState(
        { pageId: route.id },
        route.id,
        "/" + clearSlashes(path)
      );
    }

    if (this.afterNavigate) {
      await this.afterNavigate(this);
    }
    return this;
  };

  getState = () => this.state;

  setState = (newState: any): Promise<RouterState> => {
    return new Promise((resolve, reject) => {
      this.state = {
        ...this.state,
        ...newState,
      };
      resolve(this.state);
    });
  };
}
