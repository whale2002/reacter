import { handleRouter } from "./handle-router";
import { rewriteRouter } from "./rewrite-router";

const _apps = [];

export const getApps = () => {
  return _apps;
};

export const registerMicroApps = (apps) => {
  _apps = apps;
};

export const start = () => {
  // 微前端的运行原理
  // 1. 监视路由变化
  rewriteRouter();

  // 初始执行匹配
  handleRouter();
};
