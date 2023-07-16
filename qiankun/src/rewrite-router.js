import { handleRouter } from "./handle-router";

let prevRoute = "";
let nextRoute = "";

export const getPrevRoute = () => prevRoute;
export const getNextRoute = () => nextRoute;

export const rewriteRouter = () => {
  // 两种路由模式：hash模式和history模式
  // hash 路由： onhashchange
  // history 路由:
  //    history.go(), history.back(), history.forword() 使用popstate事件
  //    pushState, replaceState 需要通过函数重写的方式进行劫持

  window.addEventListener("popstate", () => {
    prevRoute = nextRoute
    nextRoute = window.location.pathname
    handleRouter();
  });

  const rawPushState = window.history.pushState;
  window.history.pushState = (...args) => {
    // 导航前
    prevRoute = window.location.pathname;
    rawPushState.apply(window.history, args);
    // 导航后
    nextRoute = window.location.pathname;
    handleRouter();
  };

  const rawReplaceState = window.history.replaceState;
  window.history.pushState = (...args) => {
    prevRoute = window.location.pathname;
    rawReplaceState.apply(window.history, args);
    nextRoute = window.location.pathname;
    handleRouter();
  };
};
