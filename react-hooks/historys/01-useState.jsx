import React from "react";
// import { useState } from "react";
import ReactDOM from "react-dom/client";

let hookState = []; // 记录所有状态的数组
let hookIndex = 0;

function useState(initialState) {
  hookState[hookIndex] = hookState[hookIndex] || initialState
  
  // 利用闭包，保证setState拿到的是自己的索引
  let currentIndex = hookIndex
  function setState(newState) {
    hookState[currentIndex] = newState
    render()
  }

  return [hookState[hookIndex++], setState]
}

function Counter() {
  let [number, setNumber] = useState(0);

  return (
    <div>
      {number}
      <br />
      <button onClick={() => setNumber(number + 1)}>＋1</button>
    </div>
  );
}

let root = ReactDOM.createRoot(document.getElementById("root"));
function render() {
  hookIndex = 0
  root.render(
    <div>
      <Counter />
      <Counter />
    </div>
  );
}
render();
