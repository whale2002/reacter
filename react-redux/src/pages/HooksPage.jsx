import { useReducer } from "react";
import { countReducer } from "../store";

function HooksPage() {
  const [state, dispatch] = useReducer(countReducer, 0);
  return (
    <div>
      <h3>HooksPage</h3>
      <button></button>
    </div>
  );
}

export default HooksPage;
