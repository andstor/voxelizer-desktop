import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { StartPage } from './StartPage';
import { MainPage } from './MainPage';

class Root extends Component {

	constructor(props) {
		super(props);
		this.state = {
			data: null,
		}
		this.onFilesLoaded = this.onFilesLoaded.bind(this);
	}

	onFilesLoaded(data) {
		this.setState({data: data})
	}

	render() {
		const { location } = this.props;

		return (
			<div>
				<div className={2}>
					<Switch>
						<Route
							location={location}
							exact
							path="/"
							render={(props) => <StartPage {...props}  onFilesLoaded={this.onFilesLoaded} />}
						/>
						<Route
							location={location}
							exact
							path="/main"
							render={(props) => <MainPage {...props} data={this.state.data} />}
						/>
					</Switch>
				</div>
			</div>
		);
	}
};

Root.propTypes = {
	location: PropTypes.shape({
		pathname: PropTypes.string.isRequired,
	}).isRequired,
};

export default Root;
