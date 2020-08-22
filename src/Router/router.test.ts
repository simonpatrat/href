import { Router } from "./index";

describe("Router", () => {
  describe("instanciation without routes", () => {
    it("should have an initial route", () => {
      const testRouter = new Router({ routes: [] });
      expect(testRouter.getRoutes().length).toEqual(1);
    });

    it("should have a 404 route as an initial route", () => {
      const testRouter = new Router({ routes: [] });
      expect(testRouter.getRoutes()[0].id).toEqual("404");
    });

    it("should have a default state", () => {
      const testRouter = new Router({ routes: [] });
      expect(testRouter.getState()).toBeDefined;
    });

    it("should have a default loading state set at false", () => {
      const testRouter = new Router({ routes: [] });
      expect(testRouter.getState().loading).toBe(false);
    });
  });

  describe("instanciation with routes", () => {
    const testRouter = new Router({
      routes: [
        {
          id: "test-route",
          path: "/test-route",
          callback: () => {},
        },
      ],
    });
    it("should contain the 404 route", () => {
      expect(testRouter.getRoutes().some((r) => r.id === "404")).toBe(true);
    });

    it("should contain the given routes", () => {
      expect(testRouter.getRoutes().some((r) => r.id === "test-route")).toBe(
        true
      );
    });
  });

  describe("Router init", () => {
    it("should call Router.navigate when Router.init is called", () => {
      const testRouter = new Router({
        routes: [
          {
            id: "test-route",
            path: "/test-route",
            callback: () => {},
          },
        ],
      });
      const spy = jest.spyOn(testRouter, "navigate");
      testRouter.init();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe("Router setState", () => {
    it("should merge router.state object with the given object when calling router.setState", () => {
      const testRouter = new Router({
        routes: [
          {
            id: "test-route",
            path: "/test-route",
            callback: () => {},
          },
        ],
      });

      testRouter.init();
      testRouter.setState({ myNewProp: "my-new-value" });
      expect(testRouter.getState()).toStrictEqual({
        loading: true,
        myNewProp: "my-new-value",
      });
    });
  });

  describe("Router navigate", () => {
    const homeRoute = {
      id: "home",
      path: "/",
      callback: () => {},
    };

    const testRouter = new Router({
      routes: [
        {
          id: "test-route",
          path: "/test-route",
          callback: () => {},
        },
        homeRoute,
      ],
    });

    const routeCallbackSpy = jest.spyOn(homeRoute, "callback");

    testRouter.init();

    it("should call setState when Router.navigate is called", () => {
      const setStateSpy = jest.spyOn(testRouter, "setState");
      testRouter.navigate("/test-route");
      expect(setStateSpy).toHaveBeenCalledTimes(1);
    });

    it("should call route.callback when Router.navigate is called with a valid path", () => {
      testRouter.navigate("/");
      expect(routeCallbackSpy).toHaveBeenCalledTimes(1);
    });
  });
});
