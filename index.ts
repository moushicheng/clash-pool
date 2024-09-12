import { config } from "dotenv";
config();
import { choiceProxyNode, getProxies } from "./request/proxies";
import { extractSelector } from "./src/proxies";
import {
  currentSelector,
  selectorsStorage,
  setCurrentSelector,
  setSelectorsStorage,
} from "./src/store";
import { selectOne } from "./utils/selectOne";

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
};
export const initPool = async (configuration: Configuration) => {
  const selectorName = configuration.selectorName || "GLOBAL";
  const period = configuration.period || 1000 * 60 * 5;
  const selectorNode = await choiceSelector(selectorName);
  const allNode: string[] = configuration.handleAllNode
    ? configuration.handleAllNode(selectorNode["all"])
    : selectorNode["all"];
  const { next } = selectOne(allNode);
  setInterval(() => {
    const nextNode = next();

    choiceProxyNode(selectorName, nextNode);
  }, period);
};

initPool({
  handleAllNode: (allNode) => {
    return allNode.filter((item) => item !== "REJECT");
  },
});
