import React from "react";
// import { useCallback } from "react";
// import { useMemo } from "react";
// import { useState } from "react";
import ReactDOM from "react-dom/client";

let hookState = []; // 记录所有状态的数组
let hookIndex = 0;

// 操作状态
function useState(initialState) {
  hookState[hookIndex] = hookState[hookIndex] || initialState;

  // 利用闭包，保证setState拿到的是自己的索引
  let currentIndex = hookIndex;
  function setState(newState) {
    hookState[currentIndex] = newState;
    render();
  }

  return [hookState[hookIndex++], setState];
}

function useMemo(factory, deps) {
  if (hookState[hookIndex]) {
    // 缓存过了
    let [lastMemo, lastDeps] = hookState[hookIndex];
    // 依赖是否发生变化
    let same = deps.every((item, index) => item === lastDeps[index]);

    if (same) {
      // 依赖不变
      hookIndex++;
      return lastMemo;
    } else {
      // 依赖发生变化
      let newMemo = factory();
      hookState[hookIndex++] = [newMemo, deps];
      return newMemo;
    }
  }
  // 第一次执行useMemo
  else {
    let newMemo = factory();
    hookState[hookIndex++] = [newMemo, deps];
    return newMemo;
  }
}

function useCallback(callback, deps) {
  if (hookState[hookIndex]) {
    // 缓存过了
    let [lastCallback, lastDeps] = hookState[hookIndex];
    // 依赖是否发生变化
    let same = deps.every((item, index) => item === lastDeps[index]);

    if (same) {
      // 依赖不变
      hookIndex++;
      return lastCallback;
    } else {
      // 依赖发生变化
      hookState[hookIndex++] = [callback, deps];
      return callback;
    }
  }
  // 第一次执行useCallback
  else {
    hookState[hookIndex++] = [callback, deps];
    return callback;
  }
}

function App() {
  const [name, setName] = useState("qhy");
  const [age, setAge] = useState(20);

  const data = useMemo(() => ({ age }), [age]);
  const handleClick = useCallback(() => {
    setAge(age + 1);
  }, [age]);

  return (
    <div>
      {name}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Child data={data} handleClick={handleClick} />
    </div>
  );
}

function Child(props) {
  console.log("child render");
  const { data, handleClick } = props;
  return (
    <div>
      {data.age}
      <button onClick={handleClick}>点击+1</button>
    </div>
  );
}
Child = React.memo(Child);

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
