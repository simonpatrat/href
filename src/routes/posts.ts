import { Router, Route } from "../Router/index";
import { callApi } from "../api";
import { renderPage } from "../page";

export const postsRoute = {
  path: "/posts",
  exact: true,
  callback: async (path: string, route: Route, router: Router) => {
    const getData = async () => {
      let { data: posts } = await callApi(path);
      let response: {
        data: { [key: string]: any };
      } = {
        data: {
          posts,
        },
      };
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
        response.data.postList = postList;
      }

      return response;
    };
    await renderPage({ pageName: "posts", getData, router });
  },
  id: "posts",
};
