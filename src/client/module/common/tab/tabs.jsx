import "./tab.scss";
import React, { Component } from "react";

export class

export default class DynamicTabs extends Component {

  constructor(props) {
    super(props);

    this.state = {
      index: -1
    };

    this.clickTab = this.clickTab.bind(this);
  }

  clickTab(item, i) {
    if (this.state.index === i) {
      return;
    }
    if (this.props.switchTab) {
      this.props.switchTab(item, i);
    }
    this.setState({
      index: i
    })
  }

  getTabStyle(item, i) {
    return "tab " + (this.state.index === i ? " active" : "");
  }

  render() {
    return (
      <div className="tabs dynamic">
        this.props.tabs.map((item, i) => {
          <div key={i} className={this.getTabStyle(item, i)} onClick={this.clickTab(item, i)}>
            {item.name}
          </div>
        })
      </div>
    );
  }
}
