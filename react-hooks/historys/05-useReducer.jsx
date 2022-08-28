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
  return useReducer(null, initialState);
}
function useReducer(reducer, initialState) {
  hookStates[hookIndex] = hookStates[hookIndex] || initialState;
  let currentIndex = hookIndex;

  function dispatch(action) {
    hookStates[currentIndex] = reducer
      ? reducer(hookStates[currentIndex], action)
      : action;
    render();
  }
  return [hookStates[hookIndex++], dispatch];
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
  function reducer(state, action) {
    switch (action.type) {
      case "add":
        return state + 1;
      default:
        return state; // 还用来初始化默认状态的
    }
  }
  let [state, dispatch] = useReducer(reducer, 0);
  return (
    <div>
      <span>{state}</span>
      <button onClick={() => dispatch({ type: "add" })}>+</button>
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
