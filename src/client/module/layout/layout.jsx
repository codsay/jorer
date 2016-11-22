import React, { Component } from "react";

import Header from "./header";
import Footer from "./footer";
import Main from "./main";

const { ipcRenderer } = require('electron');
ipcRenderer.on("api/drive/list-root$", (event, arg) => {
  console.log(arg);
});
ipcRenderer.send("api/drive/list-root");

export default class Layout extends Component {
  render() {
    return (
      <div className="mainLayout">
        <Header />
        <Main />
        <Footer />
      </div>
    );
  }
}
