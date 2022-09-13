import { combineReducers } from "redux";
import homeReducer from "./home";
import personReducer from "./person";

export default combineReducers({
  home: homeReducer,
  person: personReducer,
});
