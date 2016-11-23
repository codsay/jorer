import "./node.scss";
import React, { Component } from "react";

import { ipcRenderer as ipc, remote } from "electron";
const fs = remote.require('fs');
const drivelist = remote.require('drivelist');
const path = remote.require("path");
const util = remote.require('util');

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
      const resolve = (result) => {
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
      }
      if (item && item.isDirectory) {
        fs.readdir(item.path, (error, paths) => {
          if (error) throw error;
          let otherItems = [];
          let dirItems = [];
          paths.forEach(pathDir => {
            const fullDir = path.join(item.path, pathDir);
            try {
              const stats = fs.statSync(fullDir);
              let newItem = {
                name: pathDir,
                path: fullDir,
                isFile: stats.isFile(),
                isDirectory: stats.isDirectory(),
                isBlockDevice: stats.isBlockDevice(),
                isFIFO: stats.isFIFO(),
                isSocket: stats.isSocket()
              };
              if (newItem.isDirectory) {
                dirItems.push(newItem);
              } else {
                otherItems.push(newItem);
              }
            } catch (e) {
            }
          });
          resolve(dirItems.concat(otherItems));
        });
      } else {
        drivelist.list((error, drives) => {
          if (error) throw error;
          const points = drives[0].mountpoints;
          const items = [];
          for (let point of points) {
            items.push({
              name: path.join(point.path, "/"),
              path: path.join(point.path, "/"),
              isDirectory: true
            });
          }
          resolve(items);
        });
      }
    }
    this.props.updateContent(item);
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
                && <Node items={item.children} level={this.state.level + 1} parentIndex={i} updateContent={this.props.updateContent} /> }
            </div>
          )
        }
      </div>
    );
  }
}
