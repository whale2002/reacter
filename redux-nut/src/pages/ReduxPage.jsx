import { Component } from "react";
import store from "../store";

class ReduxPage extends Component {
  // 组件挂载以后订阅更新
  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate();
    });
  }
  componentWillUnmount() {
    this.unsubscribe();
  }

  add = () => {
    store.dispatch({ type: "ADD" });
  };
  minus = () => {
    store.dispatch((dispatch) => {
      setTimeout(() => {
        dispatch({ type: "MINUS" })
      }, 1000);
    });
  };

  render() {
    return (
      <div>
        <h3>ReduxPage</h3>
        <p>{store.getState()}</p>
        <button onClick={this.add}>add</button>
        <button onClick={this.minus}>minus</button>
      </div>
    );
  }
}

export default ReduxPage;
