import React, { Component } from "react";

export const DisplayPanel = props => (
  <div className="display-panel">
    <div>
      { this.props.items &&
        this.props.items.map((item, i) =>
          <div className="item" key={`dp_${i}`}>
            <div className="path" onClick={(event) => {this.props.handlePath(item)}}>{item.name}</div>
          </div>
        )
      }
    </div>
  </div>
)
