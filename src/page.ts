import { SITE_TITLE } from "./constants";
export const setLoading = (isLoading: boolean) => {
  const root = document.querySelector("#root");
  if (isLoading) {
    if (root?.innerHTML) root.innerHTML = "Loading...";
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
  scope?: string;
  beforeRender?: (pageHtmlText: string) => Promise<any>;
  afterRender?: (pageHtmlText: string) => Promise<any>;
};

export const renderPage = async ({
  pageName,
  scope,
  beforeRender,
  afterRender,
}: RenderPageParams): Promise<string> => {
  setLoading(true);
  const page = await fetch(`/pages/${pageName}.html`);
  let pageContent = await page.text();
  if (beforeRender) {
    pageContent = await beforeRender(pageContent);
  }
  const root = scope
    ? document.querySelector(`#${scope}`)
    : document.querySelector("#root");
  setLoading(false);
  if (root?.innerHTML) {
    root.innerHTML = pageContent;
    await setTitle(pageName);
    await setMetas([
      {
        property: "og:title",
        content: pageName,
      },
    ]);

    if (afterRender) {
      pageContent = await afterRender(pageContent);
    }
    return root.innerHTML;
  }
  return "";
};
