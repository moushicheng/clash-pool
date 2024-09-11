import { config } from "dotenv";
config();
import { getProxies } from "./request/proxies";
import { extractSelector } from "./src/proxies";
import {
  currentSelector,
  selectorsStorage,
  setCurrentSelector,
  setSelectorsStorage,
} from "./src/store";

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
  selectorName: string;
  period: number; //轮换ip周期
};
export const initPool = async (
  configuration: Configuration = { period: 1000 * 60 * 5, selectorName: "" }
) => {
  const selectorNode = await choiceSelector(
    configuration.selectorName || "GLOBAL"
  );
  const allNode: string[] = selectorNode["all"];
  setInterval(() => {}, configuration.period);
};

initPool();
