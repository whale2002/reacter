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
function useEffect(callback, deps) {
  if (hookStates[hookIndex]) {
    let [lastDestroy, lastDeps] = hookStates[hookIndex];
    let same = false;
    if (lastDeps) {
      same = deps.every((item, index) => item === lastDeps[index]);
    }
    if (same) {
      // 依赖没有发生变化，继续执行
      hookIndex++;
    } else {
      lastDestroy && lastDestroy();
      const destroy = callback();
      hookStates[hookIndex++] = [destroy, deps];
    }
  }
  // 第一次调用useEffect，hookStates[hookIndex]不存在
  else {
    const destroy = callback();
    hookStates[hookIndex++] = [destroy, deps];
  }
}

function App() {
  const [name, setName] = useState("qhy");
  const [age, setAge] = useState(20);

  useEffect(() => {
    console.log("effect hook");

    return () => {
      console.log('destroy');
    }
  }, [age]);

  return (
    <div>
      {name}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      {age}
      <button onClick={() => setAge(age + 1)}>+1</button>
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
