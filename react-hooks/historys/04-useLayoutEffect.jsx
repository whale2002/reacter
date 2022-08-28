import React from "react";
// import { useEffect } from "react";
// import { useCallback } from "react";
// import { useMemo } from "react";
// import { useState } from "react";
import ReactDOM from "react-dom/client";

let hookStates = []; // 记录所有状态的数组
let hookIndex = 0;

// useState操作状态
function useState(initialState) {
  hookStates[hookIndex] = hookStates[hookIndex] || initialState;

  // 利用闭包，保证setState拿到的是自己的索引
  let currentIndex = hookIndex;
  function setState(newState) {
    hookStates[currentIndex] = newState;
    render();
  }

  return [hookStates[hookIndex++], setState];
}
// useMemo缓存对象
function useMemo(factory, deps) {
  if (hookStates[hookIndex]) {
    // 缓存过了
    let [lastMemo, lastDeps] = hookStates[hookIndex];
    // 依赖是否发生变化
    let same = deps.every((item, index) => item === lastDeps[index]);

    if (same) {
      // 依赖不变
      hookIndex++;
      return lastMemo;
    } else {
      // 依赖发生变化
      let newMemo = factory();
      hookStates[hookIndex++] = [newMemo, deps];
      return newMemo;
    }
  }
  // 第一次执行useMemo
  else {
    let newMemo = factory();
    hookStates[hookIndex++] = [newMemo, deps];
    return newMemo;
  }
}
// useCallback缓存函数
function useCallback(callback, deps) {
  if (hookStates[hookIndex]) {
    // 缓存过了
    let [lastCallback, lastDeps] = hookStates[hookIndex];
    // 依赖是否发生变化
    let same = deps.every((item, index) => item === lastDeps[index]);

    if (same) {
      // 依赖不变
      hookIndex++;
      return lastCallback;
    } else {
      // 依赖发生变化
      hookStates[hookIndex++] = [callback, deps];
      return callback;
    }
  }
  // 第一次执行useCallback
  else {
    hookStates[hookIndex++] = [callback, deps];
    return callback;
  }
}
// useEffect解决的问题是什么？ 在函数式组件中，不能绑定事件、操作dom、定时器等副作用
// 有三个生命周期功能 componentDidMount componentDidUpdate componentWillUnmount
// useEffect(宏任务执行)和useLayoutEffect(微任务执行)
function useEffect(callback, deps) {
  if (hookStates[hookIndex]) {
    let [lastDestroy, lastDeps] = hookStates[hookIndex];
    let same = false;
    if (lastDeps) {
      // 空依赖也走这里
      same = deps.every((item, index) => item === lastDeps[index]);
    }
    if (same) {
      // 依赖没有发生变化，继续执行
      hookIndex++;
    } else {
      lastDestroy && lastDestroy();
      let arr = [, deps];
      setTimeout(() => {
        arr[0] = callback();
      });
      hookStates[hookIndex++] = arr;
    }
  }
  // 第一次调用useEffect，hookStates[hookIndex]不存在
  else {
    let arr = [, deps];
    setTimeout(() => {
      arr[0] = callback();
    });
    hookStates[hookIndex++] = arr;
  }
}
function useLayoutEffect(callback, deps) {
  if (hookStates[hookIndex]) {
    let [lastDestroy, lastDeps] = hookStates[hookIndex];
    let same = false;
    if (lastDeps) {
      // 空依赖也走这里
      same = deps.every((item, index) => item === lastDeps[index]);
    }
    if (same) {
      // 依赖没有发生变化，继续执行
      hookIndex++;
    } else {
      lastDestroy && lastDestroy();
      let arr = [, deps];
      queueMicrotask(() => {
        arr[0] = callback();
      });
      hookStates[hookIndex++] = arr;
    }
  }
  // 第一次调用useEffect，hookStates[hookIndex]不存在
  else {
    let arr = [, deps];
    queueMicrotask(() => {
      arr[0] = callback();
    });
    hookStates[hookIndex++] = arr;
  }
}

function useRef(initialState) {
  hookStates[hookIndex] = hookStates[hookIndex] || { current: initialState };
  return hookStates[hookIndex++];
}

function App() {
  let box1 = useRef();
  let box2 = useRef();

  const style = { width: "100px", height: "100px" };

  useEffect(() => {
    // 宏任务
    box1.current.style.transform = "translate(300px)"; // 0-300 动画
    box1.current.style.transition = "all .5s";
  }, []); // 默认刚才咱们写的时候会立刻执行 此函数
  useLayoutEffect(() => {
    // 微任务
    box2.current.style.transform = "translate(300px)"; // 300-300
    box2.current.style.transition = "all .5s";
  }, []);
  // 渲染时机问题 正常渲染 先走宏任务(script)   [setTimeout]   [promise]
  // 会先清空微任务 , 再去看是否页面达到了渲染时机，如果达到了渲染时机会进行页面渲染，再去执行下一个宏任务
  return (
    <div>
      <div ref={box1} style={{ ...style, background: "yellow" }}></div>
      <div ref={box2} style={{ ...style, background: "green" }}></div>
    </div>
  );
}

let root = ReactDOM.createRoot(document.getElementById("root"));
function render() {
  hookIndex = 0;
  root.render(
    <div>
      <App />
    </div>
  );
}
render();
