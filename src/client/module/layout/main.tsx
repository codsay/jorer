import "./main.scss";
import React, { Component } from "react";
import interact from "interact.js";

import { Node } from "../common/tree-view";
import { DisplayPanel } from "../content/display-panel";

import { remote } from "electron";
const fs = remote.require('fs');
const drivelist = remote.require('drivelist');
const path = remote.require("path");
const util = remote.require('util');

const DEFAULT_CONFIG = {
  edges: {
    top: true,

    right: true,
    bottom: true,
    left: true
  },

  resizeConfig: {
    type: "fixed",
    minSize: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  }
};

const config = Object.assign({}, DEFAULT_CONFIG, {
  edges: {
    top: false,
    bottom: false,
    left: false,
    right: true
  }
});

export class Main extends Component {

  constructor(props) {
    super(props);

    this.state = {
      rootItems: [],
      items: [],
      prevItem: null,
      currentItems: []
    };

    interact(".cs-resizable")
      .resizable(config)
      .on("resizemove", (event) => {
        const target = event.target;
        const parent = target.parentNode;
        const minSize = config.resizeConfig.minSize;

        const fixed = config.resizeConfig.type === "fixed";

        if (config.edges.left || config.edges.right) {
          let width = event.rect.width;
          if (fixed) {
            target.style.width = width + "px";
          } else {
            let totalWidth = parent.clientWidth;
            let widthPer = width / totalWidth * 100;
            if (widthPer < minSize.left) widthPer = minSize.left;
            else if (widthPer > (100 - minSize.right)) widthPer = (100 - minSize.right);

            target.style.width  = widthPer + '%';
          }
        }

        if (config.edges.top || config.edges.bottom) {
          let height = event.rect.height;
          if (fixed) {
            target.style.height = height + 'px';
          } else {
            let totalHeight = parent.clientHeight;
            let heightPer = height / totalHeight * 100;
            if (heightPer < minSize.top) heightPer = minSize.top;
            else if (heightPer > (100 - minSize.bottom)) heightPer = (100 - minSize.bottom);

            target.style.height = heightPer + '%';
          }
        }
      });

    this.handlePath = this.handlePath.bind(this);
    this.handlePath(null, -1);
  }

  handlePath(item) {
    if (item) {
      if (this.state.prevItem) this.state.prevItem.active = false;
      this.state.prevItem = item;
      item.active = true;
    }
    if (item && item.children && item.children.length) {
      item.hideChildren = !item.hideChildren;
      this.setState({
        items: this.state.items,
        currentItems: !item.hideChildren ? item.children : (item.parent ? item.parent.children : this.state.rootItems),
        prevItem: this.state.prevItem
      })
    } else {
      if (item) {
        if (item.isDirectory) {
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
                  isSocket: stats.isSocket(),
                  children: [],
                  parent: item
                };
                if (newItem.isDirectory) {
                  dirItems.push(newItem);
                } else {
                  otherItems.push(newItem);
                }
              } catch (e) {
              }
            });
            item.children = dirItems.concat(otherItems);
            this.setState({
              items: this.state.items,
              currentItems: item.children,
              prevItem: this.state.prevItem
            })
          });
        }
      } else {
        drivelist.list((error, drives) => {
          if (error) throw error;
          const points = drives[0].mountpoints;
          const items = [];
          for (let point of points) {
            items.push({
              name: path.join(point.path, "/"),
              path: path.join(point.path, "/"),
              isDirectory: true,
              children: []
            });
          }
          this.setState({
            rootItems: items,
            items: items,
            currentItems: items
          })
        });
      }
    }
  }

  render() {
    return (
      <div className="main">
        <div className="left navigation cs-resizable">
          <Node items={this.state.items} parentIndex={0} level={0} handlePath={this.handlePath} />
        </div>
        <div className="middle">
          <DisplayPanel items={this.state.currentItems} handlePath={this.handlePath} />
        </div>
        <div className="right">
          Content
        </div>
      </div>
    );
  }
}
