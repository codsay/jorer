import React from "react";
import ReactDOM from "react-dom";
import { MuiThemeProvider } from "material-ui";

import Layout from "../layout/layout";

const App = () => (
  <MuiThemeProvider>
    <Layout />
  </MuiThemeProvider>
);

ReactDOM.render(<App />, document.getElementById("root"));
