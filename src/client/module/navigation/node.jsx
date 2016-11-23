import "./node.scss";
import React, { Component } from "react";

import { ipcRenderer as ipc } from "electron";

export default class Node extends Component {

  constructor(props) {
    super(props);

    this.state = {
      items: this.props.items || [],
      parentIndex: this.props.parentIndex,
      level: this.props.level
    }
    if (this.props.level === 0) {
      this.handlePath(null, -1);
    }
  }

  handlePath(item, index) {
    if (item && item.children && item.children.length) {
      item.hideChildren = !item.hideChildren;
      this.setState({
        items: this.state.items
      })
    } else {
      ipc.once("api/drive/list-all$", (event, result) => {
        let items;
        if (index < 0) {
          items = this.state.items;
        } else {
          items = this.state.items[index].children = [];
        }
        for (let itemResult of result) {
          items.push(itemResult);
        }
        this.setState({
          items: this.state.items
        })
      })
      ipc.send("api/drive/list-all", item);
    }
  }

  render() {
    return (
      <div className={`node node-level-${this.state.level}`}>
        { this.state.items &&
          this.state.items.map((item, i) =>
            <div className="item" key={`${this.state.parentIndex}_${this.state.level}_${i}`}>
              <div className="path" onClick={(event) => {this.handlePath(item, i)}}>{item.name}</div>
              { item.children
                && !item.hideChildren
                && <Node items={item.children} level={this.state.level + 1} parentIndex={i} /> }
            </div>
          )
        }
      </div>
    );
  }
}
