import { initPool } from ".";

async function main() {
  const { start } = await initPool({
    handleAllNode: (allNode) => {
      return allNode.filter((item) => item !== "REJECT");
    },
    token: "kWe-LnS-en3-vfQ",
  });
  start();
}
main();
