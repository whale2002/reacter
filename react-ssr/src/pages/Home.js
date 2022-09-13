import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet";
import { fetchHomeData } from "../store/actions/home";

const Home = () => {
  const dispatch = useDispatch();
  const homeData = useSelector((state) => state.home);

  useEffect(() => {
    dispatch(fetchHomeData);
  }, []);

  const renderHead = () => {
    return (
      <Helmet>
        <title>首页</title>
      </Helmet>
    );
  };

  return (
    <div>
      {renderHead()}
      <h1 onClick={() => alert(111)}>我是首页</h1>
      {homeData.articles.map((article) => {
        return <li key={article.id}>{article.title}</li>;
      })}
    </div>
  );
};

Home.getInitialData = async (store) => {
  return store.dispatch(fetchHomeData);
};

export default Home;
