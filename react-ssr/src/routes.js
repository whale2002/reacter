import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Person from "./pages/Person";

const RoutesList = () => {
  return (
    <div>
      <ul>
        <li>
          <Link to="/">首页</Link>
        </li>
        <li>
          <Link to="/person">个人中心页</Link>
        </li>
      </ul>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/person" element={<Person />} />
      </Routes>
    </div>
  );
};

export const routesConfig = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/person",
    component: Person,
  },
];

export default RoutesList;
