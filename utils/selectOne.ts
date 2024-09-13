export const selectOne = (allNode: string[]) => {
  let i = 0;
  return {
    next: () => {
      return allNode[++i % allNode.length];
    },
    back: () => {
      return allNode[--i % allNode.length];
    },
    getCurrent: () => allNode[i % allNode.length], // 获取当前节点
    reset: () => {
      i = 0;
    },
  };
};
