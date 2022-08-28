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
function useContext(context) {
  return context._currentValue;
}
function useImperativeHandle(ref, handle) {
  ref.current = handle();
}

// 父组件 想拿到子组建的dom元素
// 类组件中可以通过ref拿到组件的实例，但是函数式组件是没有实例的
function Child(props, inputRef) {
  // 可以将组件到处的变量数据 都放在里面
  useImperativeHandle(inputRef, () => ({
    focus() {
      console.log("focus");
    },
    blur() {
      console.log("blur");
    },
  }));
  return <input type="text"></input>;
}

const ForwardChild = React.forwardRef(Child);
function App() {
  const inputRef = useRef();

  function getFoucus() {
    console.log(inputRef.current);
    inputRef.current.blur();
  }
  return (
    <div>
      <ForwardChild ref={inputRef}></ForwardChild>
      <button onClick={getFoucus}>获取焦点</button>
    </div>
  );
}

let root = ReactDOM.createRoot(document.getElementById("root"));
function render() {
  hookIndex = 0;
  root.render(<App />);
}
render();
