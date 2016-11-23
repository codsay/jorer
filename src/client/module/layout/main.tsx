import "./main.scss";
import React, { Component } from "react";
import interact from "interact.js";

import Node from "../navigation/node";
import DisplayPanel from "../content/display-panel";

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
console.log(config);


export default class Main extends Component {

  constructor(props) {
    super(props);

    this.state = {
      item: {}
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
  }

  updateContent(item) {
    console.log({
      item,
      sate: this.state,
      this
    });
    this.setState({
      item
    });
  }

  render() {
    return (
      <div className="main">
        <div className="left navigation cs-resizable">
          <Node parentIndex={0} level={0} updateContent={(item) => {this.updateContent(item)}} />
        </div>
        <div className="middle">
          <DisplayPanel item={this.state.item} />
        </div>
        <div className="right">
          Content
        </div>
      </div>
    );
  }
}
