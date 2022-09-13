import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet";
import { fetchPersonData } from "../store/actions/person";

const Person = () => {
  const dispatch = useDispatch();
  const personData = useSelector((state) => state.person);

  useEffect(() => {
    dispatch(fetchPersonData);
  }, []);

  const renderHead = () => {
    return (
      <Helmet>
        <title>个人中心页面</title>
      </Helmet>
    );
  };

  return (
    <div>
      {renderHead()}
      <h1 onClick={() => alert(111)}>我是个人中心页</h1>
      <p>名称：{personData?.userInfo?.username}</p>
      <p>职业：{personData?.userInfo?.job}</p>
    </div>
  );
};

Person.getInitialData = async (store) => {
  return store.dispatch(fetchPersonData);
};

export default Person;
