type Post = {
  id: number | string;
  title: string;
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
  },
  "/post/mon-deuxieme-post": {
    id: 2,
    title: "Mon deuxième post",
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
