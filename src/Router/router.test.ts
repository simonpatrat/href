import { Router } from "./index";

test("should have an initial route", () => {
  const testRouter = new Router({ routes: [] });
  expect(testRouter.getRoutes().length).toEqual(1);
});

test("should have a 404 route as an initial route", () => {
  const testRouter = new Router({ routes: [] });
  expect(testRouter.getRoutes()[0].id).toEqual("404");
});

test("should have a default state", () => {
  const testRouter = new Router({ routes: [] });
  expect(testRouter.getState()).toBeDefined;
});

test("should have a default loading state set at false", () => {
  const testRouter = new Router({ routes: [] });
  expect(testRouter.getState().loading).toBe(false);
});
