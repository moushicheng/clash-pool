import { request } from ".";

export const getProxies = async () => {
  return await request
    .get("/proxies/")
    .then((response) => {
      return response.data.proxies;
    })
    .catch((error) => {
      console.error("请求错误:", error.response.data);
    });
};
