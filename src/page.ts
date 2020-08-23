import { hackLinks } from "./links";
import { SITE_TITLE } from "./constants";
import { Router } from "./Router/index";

export const setLoading = (isLoading: boolean) => {
  const root = document.querySelector("#root");
  if (isLoading) {
    if (root?.innerHTML) root.innerHTML = "Loading...";
  }

  const loader: HTMLDivElement | null = document.querySelector(".loading");
  const loadingBar: HTMLDivElement | null = document.querySelector(
    ".loading__bar"
  );
  if (loader && loadingBar) {
    if (isLoading) {
      loader.style.height = "5px";
      loadingBar.style.transform = `scaleX(1)`;
      loadingBar.style.transform = `all 5000ms linear`;
    } else {
      setTimeout(() => {
        loader.style.height = "";
        loadingBar.style.transform = ``;
        // loadingBar.style.transform = `none`;
      }, 200);
    }
  }
};

export const setTitle = (pageTitle: string) => {
  document.title = `${pageTitle} | ${SITE_TITLE}`;
};

type Meta = {
  name?: string;
  content?: string;
  property?: string;
  charset?: string;
};

export const setMetas = (metas: Meta[] | []) => {
  if (metas.length) {
    const documentMetas = document.head.querySelectorAll("meta");
    const documentMetaObjects = Array.from(documentMetas).map((m) => {
      return Array.from(m.attributes).reduce((acc: any, next) => {
        const { name } = next;
        acc[name] = next.value;
        return acc;
      }, {});
    });

    metas.forEach((meta: Meta) => {
      const existingMetaByName = document.querySelector(
        `meta[name="${meta.name}"]`
      );
      const existingMetaByProperty = document.querySelector(
        `meta[property="${meta.property}"]`
      );
      if (existingMetaByName && meta.content) {
        existingMetaByName.setAttribute("content", meta.content);
      } else if (existingMetaByProperty && meta.content) {
        existingMetaByProperty.setAttribute("content", meta.content);
      } else {
        const metaElement = document.createElement("meta");
        Object.entries(meta).forEach(([key, value]) => {
          if (value) {
            metaElement.setAttribute(key, value);
          }
        });
        document.head.prepend(metaElement);
      }
    });
  }
};

type RenderPageParams = {
  pageName: string;
  router: Router;
  scope?: string;
  getData?: () => Promise<any>;
  afterRender?: (pageHtmlText: string) => Promise<any>;
};

export const renderPage = async ({
  pageName,
  router,
  scope,
  afterRender,
  getData,
}: RenderPageParams): Promise<string> => {
  setLoading(true);
  let title = pageName;
  const page = await fetch(`/pages/${pageName}.html`);
  let pageContent = await page.text();

  if (getData) {
    let response = await getData();

    if (response && response.error) {
      response = await router.navigate("404");
      const html = await response.text();
      pageContent = html;
    }

    if (response.data && typeof response.data === "object") {
      const { title: pageTitle } = response.data;

      if (pageTitle) {
        title = pageTitle;
      }
      Object.keys(response.data).forEach((key, index) => {
        const value = response.data[key];
        const regex = new RegExp(`{{${key}}}`, "g");
        pageContent = pageContent.replace(regex, value);
      });
    }
  }
  const root = scope
    ? document.querySelector(`#${scope}`)
    : document.querySelector("#root");

  setLoading(false);

  if (root?.innerHTML) {
    root.innerHTML = pageContent;
    await setTitle(title);
    await setMetas([
      {
        property: "og:title",
        content: `${title} | ${SITE_TITLE}`,
      },
    ]);

    if (afterRender) {
      pageContent = await afterRender(pageContent);
    }
    hackLinks(router);
    return root.innerHTML;
  }
  return "";
};
