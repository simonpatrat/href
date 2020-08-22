export const clearSlashes = (path: string) => {
  return path.toString().replace(/\/$|^\//, "");
};
