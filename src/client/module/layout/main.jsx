import "./main.scss";
import React, { Component } from "react";

import { ipcRenderer as ipc } from "electron";

import Node from "../navigation/node";

export default class Main extends Component {

  constructor() {
    super();
    this.state = {
      items: []
    }

    ipc.on("api/drive/list-root$", (event, args) => {
      const points = args[0].mountpoints;
      const items = [];
      for (let point of points) {
        items.push({
          path: point.path + "/",
          name: point.path + "/",
          type: "directory"
        });
      }
      this.setState({
        items: items
      })
    })
    ipc.send("api/drive/list-root");
  }

  handlePath(index) {
    ipc.on("api/drive/list-root$", (event, args) => {
      const points = args[0].mountpoints;
      console.log(this);
      this.state.items[index].children = [];
      for (let point of points) {
        this.state.items[index].children.push({
          path: point.path + "/",
          name: point.path + "/",
          type: "directory"
        });
      }
      this.setState({
        items: this.state.items
      })
    })
    ipc.send("api/drive/list-root");
  }

  render() {
    return (
      <div className="main">
        <div className="left navigation">
          <Node items={this.state.items} parentIndex={0} level={0} handlePath={(index) => this.handlePath(index)} />
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
