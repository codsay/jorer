import React from "react";
import ReactDOM from "react-dom";
import { MuiThemeProvider } from "material-ui";

const App = () => (
  <MuiThemeProvider>
    <div className="main">
      Hello Jorer!
    </div>
  </MuiThemeProvider>
);

ReactDOM.render(<App />, document.getElementById("root"));
