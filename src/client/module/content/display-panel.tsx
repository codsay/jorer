import React, { Component } from "react";

export default class DisplayPanel extends Component {

	constructor(props) {
		super(props);
	}

  render() {
  	console.log(this.props);
    return (
      <div className="display-panel">
        { this.props.item && this.props.item.children &&
          this.props.item.children.map((item, i) =>
            <div className="item" key={i}>
              <div className="path">{item.name}</div>
            </div>
          )
        }
      </div>
    );
  }
}
