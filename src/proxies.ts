export type proxiesNode = {
  alive: boolean;
  all: string[];
  history: string[];
  name: string;
  now: string;
  type: string;
  upp: boolean;
};
export type proxies = {
  [key: string]: proxiesNode;
};
export const extractSelector = (proxies: proxies) => {
  const result: proxies = {};
  for (const [name, node] of Object.entries(proxies)) {
    if (node.type === "Selector") result[name] = node;
  }
  return result;
};
