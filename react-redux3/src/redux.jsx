import React, { useContext, useEffect, useState, createContext } from "react";

// 核心 createStore， connect， Provider

const appContext = createContext(null);

let state = undefined;
let listeners = [];
let reducer = undefined;

const setState = (newState) => {
  state = newState;
  listeners.map((fn) => fn(state));
};

const changed = (oldState, newState) => {
  let changed = false;
  for (let key in oldState) {
    if (oldState[key] !== newState[key]) {
      changed = true;
    }
  }
  return changed;
};

export const store = {
  getState() {
    return state;
  },

  dispatch(action) {
    setState(reducer(state, action));
  },

  subscribe(fn) {
    listeners.push(fn);

    return () => {
      const index = listeners.indexOf(fn);
      listeners.splice(index, 1);
    };
  },
};

export const createStore = (_reducer, initState) => {
  state = initState;
  reducer = _reducer;

  return store;
};

export const connect = (selector, dispatchSelectors) => (Component) => {
  return (props) => {
    const [, update] = useState({});
    const { dispatch } = store;

    const data = selector ? selector(state) : { state };
    const dispatchers = dispatchSelectors
      ? dispatchSelectors(dispatch)
      : { dispatch };

    useEffect(() => {
      const unSubscribe = store.subscribe(() => {
        const newData = selector ? selector(state) : { state };
        if (changed(data, newData)) {
          update({});
        }
      });

      return () => {
        unSubscribe();
      };
    }, []);

    return <Component {...props} {...dispatchers} {...data} />;
  };
};

export const Provider = ({ store, children }) => {
  return <appContext.Provider value={store}>{children}</appContext.Provider>;
};
