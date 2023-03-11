import React from "react";
import { Provider, connect, createStore } from "./redux.jsx";

const reducer = (state, { type, payload }) => {
  if (type === "updateUser") {
    return {
      ...state,
      user: {
        ...state.user,
        ...payload,
      },
    };
  } else {
    return state;
  }
};

const initState = {
  user: { name: "frank", age: 18 },
  group: { name: "前端组" },
};

const store = createStore(reducer, initState);

const App = () => {
  return (
    <Provider store={store}>
      <大儿子 />
      <二儿子 />
      <幺儿子 />
    </Provider>
  );
};

const 大儿子 = () => {
  console.log("大儿子执行了 " + Math.random());
  return (
    <section>
      大儿子
      <User />
    </section>
  );
};

const 二儿子 = () => {
  console.log("二儿子执行了 " + Math.random());
  return (
    <section>
      二儿子
      <UserModifier />
    </section>
  );
};

const 幺儿子 = connect((state) => {
  {
    group: state.group;
  }
})(() => {
  console.log("幺儿子执行了 " + Math.random());
  return <section>幺儿子</section>;
});

const User = connect((state) => {
  return { user: state.user };
}, null)(({ user }) => {
  console.log("User执行了 " + Math.random());

  return <div>User:{user.name}</div>;
});

const UserModifier = connect(null, (dispatch) => {
  return {
    updateUser: (attrs) => dispatch({ type: "updateUser", payload: attrs }),
  };
})(({ updateUser, state, children }) => {
  console.log("UserModifier执行了 " + Math.random());

  const onChange = (e) => {
    updateUser({ name: e.target.value });
  };
  return (
    <div>
      {children}
      <input value={state.user.name} onChange={onChange} />
    </div>
  );
});

export default App;
