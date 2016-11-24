import "./node.scss";
import React, { Component } from "react";

export default class Node extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={`node node-level-${this.props.level}`}>
        { this.props.items &&
          this.props.items.map((item, i) =>
            <div className="item" key={`${this.props.parentIndex}_${this.props.level}_${i}`}>
              <div className="path" onClick={(event) => {this.props.handlePath(item, i)}}>{item.name}</div>
              { item.children
                && !item.hideChildren
                && <Node items={item.children} level={this.props.level + 1} parentIndex={i} handlePath={this.props.handlePath} /> }
            </div>
          )
        }
      </div>
    );
  }
}
