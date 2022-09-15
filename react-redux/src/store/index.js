import { createStore, applyMiddleware } from "redux";

export function countReducer(state = 0, action) {
  switch (action.type) {
    case "ADD":
      return state + 1;
    case "MINUS":
      return state - 1;
    default:
      return state;
  }
}

const store = createStore(countReducer, applyMiddleware(thunk, logger));

export default store;

function thunk({ getState, dispatch }) {
  return (next) => (action) => {
    if (typeof action === "function") {
      // 执行函数，返回action
      return action(dispatch, getState);
    }

    return next(action);
  };
}
function logger({ getState, dispatch }) {
  return (next) => (action) => {
    console.log("------------");

    console.log(action.type + "执行了");

    const prevState = getState();
    console.log("pre state", prevState);

    const returnValue = next(action);

    const nextState = getState();
    console.log("next state", nextState);

    console.log("------------");

    return returnValue;
  };
}
