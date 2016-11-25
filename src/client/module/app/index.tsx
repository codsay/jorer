import React from "react";
import ReactDOM from "react-dom";
import { MuiThemeProvider } from "material-ui";

import { Layout } from "../common/layout";

const App = () => (
  <MuiThemeProvider>
    <Layout />
  </MuiThemeProvider>
);

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

ReactDOM.render(<App />, document.getElementById("root"));
