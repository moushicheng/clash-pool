import axios from "axios";
import { TOKEN } from "../const";

export const request = axios.create({
  baseURL: "http://127.0.0.1:9090", // 替换为您的 API 基础 URL
});

// 添加请求拦截器
request.interceptors.request.use(
  (config) => {
    // 在请求头中添加 Authorization
    if (TOKEN) {
      config.headers["Authorization"] = `Bearer ${TOKEN}`;
    }
    return config;
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);
