const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { Helmet } from "react-helmet";
import Routes, { routesConfig } from "./routes";
import { Provider } from "react-redux";
import createStoreInstance from "./store";

app.use(express.static("dist/public"));

app.get("*", (req, res) => {
  const store = createStoreInstance();

  const promises = routesConfig.map((route) => {
    const component = route.component;

    if (route.path === req.url && component.getInitialData) {
      return component.getInitialData(store);
    } else {
      return null;
    }
  });

  Promise.all(promises).then(() => {
    const preloadedState = store.getState();

    const content = ReactDOMServer.renderToString(
      <Provider store={store}>
        <StaticRouter location={req.url}>
          <Routes />
        </StaticRouter>
      </Provider>
    );

    console.log(content);
    const helmet = Helmet.renderStatic();

    const html = `
      <html>
        <head>
          ${helmet.title.toString()}
        </head>
        <body>
          <div id="root">${content}</div>
          <script>
            window.__PRELOAD_STATE__ = ${JSON.stringify(preloadedState)}
          </script>
          <script src="bundle_client.js"></script>
        </body>
      </html>
    `;
    console.log(html);

    res.send(html);
  });
});

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
