import type { proxies, proxiesNode } from "./proxies";

export let selectorsStorage: proxies;

export const setSelectorsStorage = (newStorage: proxies) => {
  selectorsStorage = newStorage;
};

export let currentSelector: proxiesNode;

export const setCurrentSelector = (newStorage: proxiesNode) => {
  currentSelector = newStorage;
};
