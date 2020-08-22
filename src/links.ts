import { Router } from "./Router/index";

const handleClickOnLink = (
  event: MouseEvent,
  link: HTMLAnchorElement,
  router: Router
) => {
  event.preventDefault();

  if (link) {
    const path = link.getAttribute("href");
    if (path) {
      router.navigate(path);
    } else {
      throw new Error("The link " + link + " has no href attribute");
    }
  }
};

export const hackLinks = (router: Router) => {
  const links = Array.from(document.querySelectorAll("a")).filter((l) => {
    return l.parentElement?.style?.display !== "none";
  });

  links.forEach((link) => {
    if (!link.classList.contains("spa-link")) {
      link.addEventListener("click", (event: MouseEvent) =>
        handleClickOnLink(event, link, router)
      );
      link.classList.add("spa-link");
    }
  });
};
