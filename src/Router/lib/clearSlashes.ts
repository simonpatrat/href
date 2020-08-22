export const clearSlashes = (path: string): string => {
  return path.toString().replace(/\/$|^\//, "");
};
