function createStore(reducer, enhancer) {
  if (enhancer) {
    return enhancer(createStore)(reducer);
  }
  let state = null;
  let listeners = [];

  function dispatch(action) {
    state = reducer(state, action);
    listeners.forEach((listener) => {
      listener();
    });
  }

  function getState() {
    return state;
  }

  function subscribe(listener) {
    listeners.push(listener);

    // unsubscribe
    return () => {
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  dispatch({
    type: "INIT",
  });

  return {
    dispatch,
    getState,
    subscribe,
  };
}

// 中间件返回一个enhancer增强器，增强器增强谁？增强dispatch，重写dispatch
function applyMiddleware(...middlewares) {
  return (createStore) => (reducer) => {
    const store = createStore(reducer);

    // key: 重写dispatch
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action, ...args) => store.dispatch(action, ...args),
    };

    const middlewareChain = middlewares.map((middleware) =>
      middleware(middlewareAPI)
    );

    const dispatch = compose(...middlewareChain)(store.dispatch);

    return {
      ...store,
      dispatch,
    };
  };
}

function compose(...fns) {
  if (fns.length === 0) {
    // 没有中间件
    return (args) => args;
  }

  if (fns.length === 1) {
    // 只有1个中间件
    return fns[0];
  }

  // 多个中间件
  return fns.reduce(
    (prev, next) =>
      (...args) =>
        prev(next(...args))
  );
}

// reducer 是一个纯函数，接收旧的state和action，返回新的state
const reducer = (state = 0, action) => {
  switch (action.type) {
    case "ADD":
      return state + 1;
    case "REDUCE":
      return state - 1;
    default:
      return state;
  }
};

function logger1({ dispatch, getState }) {
  return (next) => (action) => {
    const prevState = getState();
    console.log("start logging1.............");
    console.log("prev state", prevState);
    console.log("action", action);
    const result = next(action);
    const nextState = getState();
    console.log("next state", nextState);
    console.log("end logging1........");
    return result;
  };
}

function logger2({ dispatch, getState }) {
  return (next) => (action) => {
    const prevState = getState();
    console.log("start logging2.............");
    console.log("prev state", prevState);
    console.log("action", action);
    const result = next(action);
    const nextState = getState();
    console.log("next state", nextState);
    console.log("end logging2........");
    return result;
  };
}

const store = createStore(reducer, applyMiddleware(logger1, logger2));

store.subscribe(() => {
  const state = store.getState();
  console.log(state);
});

store.dispatch({
  type: "ADD",
});
