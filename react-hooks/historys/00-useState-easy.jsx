import React from "react";
// import { useState } from "react";
import ReactDOM from "react-dom/client";

let lastState; // 记录上次状态
function useState(initialState) {
  lastState = lastState || initialState;
  function setState(newState) {
    lastState = newState;
    render();
  }

  return [lastState, setState];
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
  root.render(
    <div>
      <Counter />
    </div>
  );
}
render();
