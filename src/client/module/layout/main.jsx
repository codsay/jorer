import "./main.scss";
import React, { Component } from "react";

import Node from "../navigation/node";

export default class Main extends Component {

  constructor() {
    super();
  }

  render() {
    return (
      <div className="main">
        <div className="left navigation">
          <Node parentIndex={0} level={0} />
        </div>
        <div className="middle">
          Content
        </div>
        <div className="right">
          Content
        </div>
      </div>
    );
  }
}
