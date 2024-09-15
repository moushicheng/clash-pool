import { config } from "dotenv";
config();
import { choiceProxyNode, getProxies } from "./request/proxies";
import { extractSelector } from "./src/proxies";
import {
  selectorsStorage,
  setCurrentSelector,
  setSelectorsStorage,
} from "./src/store";
import { selectOne } from "./utils/selectOne";
import axios from "axios";
import { TOKEN } from "./const";

export const getSelectors = async () => {
  if (selectorsStorage) return selectorsStorage;

  const proxies = await getProxies();
  const selectors = extractSelector(proxies);
  if (Object.keys(selectors).length === 0) {
    console.error("could not find any selectors!");
    return {};
  }
  setSelectorsStorage(selectors);

  return selectors;
};

export const choiceSelector = async (name: string) => {
  const selectors = await getSelectors();
  if (!selectors[name]) {
    throw new Error("could't find selector");
  }
  setCurrentSelector(selectors[name]);
  return selectors[name];
};

type Configuration = {
  selectorName?: string;
  period?: number; //轮换ip周期
  handleAllNode?: (allNode: string[]) => string[];
  token?: string;
};
export const initPool = async (configuration: Configuration) => {
  TOKEN.value = configuration.token;
  const selectorName = configuration.selectorName || "GLOBAL";
  const period = configuration.period || 1000 * 60 * 5;
  const selectorNode = await choiceSelector(selectorName);
  const allNode: string[] = configuration.handleAllNode
    ? configuration.handleAllNode(selectorNode["all"])
    : selectorNode["all"];
  const { next, back, reset, getCurrent } = selectOne(allNode);
  const checkConnection = async () => {
    const nextNode = next();
    choiceProxyNode(selectorName, nextNode);

    const connection = await testProxyConnection("http://www.google.com");
    if (!connection) {
      const originNode = back();
      choiceProxyNode(selectorName, originNode);
    }
  };
  let intervalId: any;
  let isRunning = false;
  return {
    getStatus() {
      return {
        node: getCurrent(),
        isRunning,
        period,
        selector: selectorName,
      };
    },
    start() {
      if (!isRunning) {
        isRunning = true;
        intervalId = setInterval(checkConnection, period);
        console.log("代理池已启动");
      }
    },
    switch(node: string) {
      choiceProxyNode(selectorName, node);
      console.log("已切换至", node);
    },
    next() {
      const nextNode = next();
      choiceProxyNode(selectorName, nextNode);
      console.log("已切换至", nextNode);
    },
    back() {
      const backNode = back();
      choiceProxyNode(selectorName, backNode);
      console.log("已切换至", backNode);
    },
    pause: () => {
      clearInterval(intervalId);
      isRunning = false;
      intervalId = null; // 清除定时器ID
      console.log("代理池已暂停");
    },
    close() {
      this.pause();
      reset();
      console.log("代理池已关闭");
    },
    restart() {
      this.close();
      this.start();
    },
  };
};

export const proxy = axios.create({
  proxy: {
    host: "127.0.0.1",
    port: 7890,
  },
});
export async function testProxyConnection(url: string, silent?: boolean) {
  try {
    const response = await proxy.get(url);
    if (!silent) console.log("Proxy connection successful:", response.status);
    return true;
  } catch (error) {
    if (error instanceof Error && !silent)
      console.error("Proxy connection failed:", error.message);
    return false;
  }
}
