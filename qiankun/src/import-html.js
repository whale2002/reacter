import { fetchResource } from "./utils";

export const importHTML = async (url) => {
  const html = await fetchResource(url);
  const template = document.createElement("div");
  template.innerHTML = html;

  const scripts = template.querySelector("script");

  function getExternalScripts() {
    return Promise.all(
      Array.from(scripts).map((script) => {
        const scr = script.getAttribute("scr");
        if (!scr) {
          return Promise.resolve(script.innerHTML);
        } else {
          return fetchResource(src.startsWith("https") ? src : `${url}${src}`);
        }
      })
    );
  }

  /**
   * 加载并执行子应用 js 代码
   */
  async function execScripts() {
    const scripts = await getExternalScripts();

    // 手动构造一个 commonjs 模块环境
    const module = { exports: {} };
    const exports = module.exports;

    // eval 执行的代码可以访问外部变量
    scripts.forEach((script) => eval(script));

    return module.exports;
  }

  return {
    template,
    getExternalScripts,
    execScripts,
  };
};
