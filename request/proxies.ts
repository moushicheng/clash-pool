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
export const choiceProxyNode = async (selector: string, node: string) => {
  const url = `/proxies/${selector}`; // 替换为实际的 URL
  console.log(`已切换节点:【${selector}:${node}】`);
  return await request.put(
    url,
    { name: node },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const getDelay = async (node: string) => {
  const url = `/proxies/${node}/delay`; // 替换为实际的 URL

  return await request.get(url).then((res) => res.data);
};

export const testDelay = async () => {
  const url = "http://cp.cloudflare.com/generate_204";
  const start = Date.now();

  try {
    await request.get(url);
    const delay = Date.now() - start;
    console.log(`Delay: ${delay} ms`);
  } catch (error) {
    if (error instanceof Error) return console.error("Error:", error.message);
    console.error(error);
  }
};
