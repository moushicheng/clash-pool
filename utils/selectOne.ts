export const selectOne = (allNode: string[]) => {
  let i = 0;
  return {
    next: () => {
      return allNode[i++ % allNode.length];
    },
  };
};
