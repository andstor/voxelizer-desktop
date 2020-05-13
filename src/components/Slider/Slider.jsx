import React, { Component } from 'react';
import './Slider.css';

class Slider extends Component {

	constructor(props) {
		super(props);
		this.state = {
			value: 0,
		}

		this.handleOnChange = this.handleOnChange.bind(this);
	}

	handleOnChange(event) {
		this.setState({ value: event.target.value });
		this.props.onChange(event.target.value);
	}

	render() {
		return (
			<div className="slidecontainer">
				<input
					type="range"
					min="1"
					max="512"
					value={this.state.value}
					className="slider"
					id="myRange"
					onChange={this.handleOnChange} />
			</div >
			);
	}
}

export default Slider;
