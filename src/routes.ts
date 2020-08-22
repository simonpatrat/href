import { renderPage } from "./page";
import { callApi } from "./api";
import { Route } from "./Router/index";
import { hackLinks } from "./links";

export const routes: Route[] = [
  {
    path: "/",
    exact: true,
    callback: async (path, route, router) => {
      await renderPage({ pageName: "home" });
      hackLinks(router);
    },
    id: "home",
  },
  {
    path: "/about",
    exact: true,
    callback: async (path, route, router) => {
      await renderPage({ pageName: "about" });
      hackLinks(router);
    },
    id: "about",
  },
  {
    path: "/404",
    exact: true,
    callback: async (path, route, router) => {
      await renderPage({ pageName: "404" });
      hackLinks(router);
    },
    id: "404",
  },
  {
    path: "/posts",
    exact: true,
    callback: async (path, route, router) => {
      const beforeRender = async (pageHtmlText: string) => {
        let { data: posts } = await callApi(path);

        let newHtml = pageHtmlText;
        if (posts) {
          const postList = `
            <ul>
              ${Object.keys(posts)
                .map((postUrl) => {
                  const post = posts[postUrl];
                  return `<li>
                  <a href="${postUrl}">${post.title}</a>
                </li>`;
                })
                .join("")}
            </ul>
          `;

          newHtml = newHtml.replace(/{{postList}}/g, postList);
        }

        return newHtml;
      };
      await renderPage({ pageName: "posts", beforeRender });
      hackLinks(router);
    },
    id: "posts",
  },
  {
    path: "/post/:slug",
    exact: true,
    callback: async (path, route, router) => {
      const beforeRender = async (pageHtmlText: string) => {
        let response = await callApi(path);
        let { data } = response;
        if (response && response.error) {
          response = await router.navigate("404");
          const html = await response.text();
          return html;
        }
        let newHtml = pageHtmlText;
        if (response.data && typeof response.data === "object") {
          Object.keys(response.data).forEach((key, index) => {
            const value = response.data[key];
            const regex = new RegExp(`{{${key}}}`, "g");
            newHtml = newHtml.replace(regex, value);
          });
        }

        return newHtml;
      };

      await renderPage({ pageName: "post/slug", beforeRender });
    },
    id: "post",
  },
];
