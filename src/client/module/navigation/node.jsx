import "./node.scss";
import React, { Component } from "react";

import { ipcRenderer as ipc } from "electron";

export default class Node extends Component {

	constructor(props) {
		super(props);
	}

	handlePath(event, index) {
		event.stopPropagation();
		this.props.handlePath(index)
	}

	handlePathChild(index) {
		console.log("c", this);
		ipc.on("api/drive/list-root$", (event, args) => {
      const points = args[0].mountpoints;
      this.state.items[index].children = [];
      for (let point of points) {
        this.state.items[index].children.push({
          path: point.path + "/",
          name: point.path + "/",
          type: "directory"
        });
      }
    })
    ipc.send("api/drive/list-root");
	}

  render() {
    return (
      <div className={`node node-level-${this.props.level}`}>
      	{ this.props.items &&
      		this.props.items.map((item, i) =>
      			<div className="item" key={`${this.props.parentIndex}_${this.props.level}_${i}`}>
      				<div className="path" onClick={(event) => this.handlePath(event, i)}>{item.name}</div>
      				{ item.children && <Node items={item.children} level={this.props.level + 1} parentIndex={i} handlePath={this.handlePathChild} /> }
      			</div>
      		)
      	}
      </div>
    );
  }
}
