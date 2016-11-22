import React, { Component } from "react";

import Header from "./header";
import Footer from "./footer";
import Main from "./main";

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
