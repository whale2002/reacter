import { getApps } from ".";
import { importHTML } from "./import-html";
import { getNextRoute, getPrevRoute } from "./rewrite-router";

export const handleRouter = async () => {
  const apps = getApps();

  // 卸载上一个应用
  const prevRoute = getPrevRoute();
  const prevApp = apps.find((item) => prevRoute.startsWith(item.activeRule));
  await unmount(prevApp);

  // 加载下一个应用
  // 2. 匹配子应用
  // 2.1 获取当前的路由路径 -> window.location.pathname
  // 2.2 去 apps 里面查找

  // 模糊匹配
  const nextRoute = getNextRoute();
  const app = apps.find((item) => nextRoute.startsWith(item.activeRule));

  if (!app) return;

  // 3. 加载子应用
  // 1. 客户端渲染需要通过执行 js 来渲染页面
  // 2. 浏览器处于安全考虑，innerHTML 中的 script 不会加载执行 需要我们手动获取 js 然后执行，挂载到 window 中，等到容器调用生命周期钩子
  const container = document.querySelector(app.container);
  const { template, execScripts } = await importHTML(app.enery);
  container.appendChild(template);

  window.__POWER_BY_QIANKUN__ = true;

  const appExport = execScripts();
  app.bootstrap = appExport.bootstrap;
  app.mount = appExport.mount;
  app.unmount = appExport.unmount;

  await bootstrap(app);
  await mount(app);

  // 4. 渲染子应用
};

async function bootstrap(app) {
  app.bootstrap && (await app.bootstrap());
}

async function mount(app) {
  app.mount &&
    (await app.mount({ container: document.querySelector(app.container) }));
}

async function unmount(app) {
  app.unmount &&
    (await app.unmount({ container: document.querySelector(app.container) }));
}
