type Post = {
  id: number | string;
  title: string;
  content?: string;
};

type Posts = { [key: string]: Post };

type ResponseError = {
  error: boolean;
  code: number;
};

export const posts: Posts = {
  "/post/test": {
    id: 1,
    title: "Mon premier post",
    content: `<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam fugit iste sequi fuga voluptates aliquid mollitia provident excepturi laboriosam quidem neque labore dignissimos, eveniet natus. Rem nihil saepe unde amet.</p>
<h2>Post section</h2>
<p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quis esse eum vero ut veritatis laudantium veniam totam nesciunt laborum minima!</p>
<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis porro ut maxime fugit deserunt voluptate quibusdam et! Asperiores, architecto est ullam odit voluptatibus excepturi nobis maxime quae temporibus aliquam unde!</p>`,
  },
  "/post/mon-deuxieme-post": {
    id: 2,
    title: "Mon deuxième post",
    content: `<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam fugit iste sequi fuga voluptates aliquid mollitia provident excepturi laboriosam quidem neque labore dignissimos, eveniet natus. Rem nihil saepe unde amet.</p>
<p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quis esse eum vero ut veritatis laudantium veniam totam nesciunt laborum minima!</p>
<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis porro ut maxime fugit deserunt voluptate quibusdam et! Asperiores, architecto est ullam odit voluptatibus excepturi nobis maxime quae temporibus aliquam unde!</p>`,
  },
};

export const waitAndRespond = (delay: number, response: any): Promise<any> => {
  return new Promise(function (resolve) {
    setTimeout(() => {
      if (response) {
        resolve({
          error: false,
          data: response,
        });
      } else {
        resolve({ error: true, code: 404 });
      }
    }, delay);
  });
};

export const callApi = async (url: string): Promise<any> => {
  if (url === "/posts") {
    const response = await waitAndRespond(200, posts);
    return response;
  }

  const response: Post | ResponseError = await waitAndRespond(500, posts[url]);
  return response;
};
