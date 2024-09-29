import axios from "axios";
export const request = axios.create();

// 添加请求拦截器
request.interceptors.request.use(
  (config) => {
    // 在请求头中添加 Authorization
    // if (TOKEN.value) {
    //   config.headers["Authorization"] = `Bearer ${TOKEN.value}`;
    // }
    return config;
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);
