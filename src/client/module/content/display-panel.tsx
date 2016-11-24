import React, { Component } from "react";
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';

export default class DisplayPanel extends Component {

	constructor(props) {
		super(props);

		this.state = {
      slideIndex: 0,
    };

    this.handleChange = this.handleChange.bind(this);
	}

	handleChange(value) {
    this.setState({
      slideIndex: value,
    });
  };

  render() {
    return (
      <div className="display-panel">
	      <Tabs onChange={this.handleChange} value={this.state.slideIndex}>
			    <Tab label="D:/" value={0}></Tab>
			    <Tab label="C:/" value={1}></Tab>
			    <Tab label="E:/" value={2}></Tab>
			  </Tabs>
			  <SwipeableViews index={this.state.slideIndex} onChangeIndex={this.handleChange}>
          <div>
          	{ this.props.items &&
		          this.props.items.map((item, i) =>
		            <div className="item" key={`dp_${i}`}>
		              <div className="path">{item.name}</div>
		            </div>
		          )
	        	}
          </div>
        </SwipeableViews>
      </div>
    );
  }
}
