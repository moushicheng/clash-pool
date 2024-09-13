import axios from "axios";

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
