import React, { Component } from "react";

import Header from "./header";
import Footer from "./footer";
import Main from "./main";

export const Layout = props (
  <div className="mainLayout">
    <Header />
    <Main />
    <Footer />
  </div>
);
