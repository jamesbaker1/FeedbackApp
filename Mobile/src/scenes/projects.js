'use strict';

//Import libraries
import React, { Component } from 'react';
import {
	Text,
	View,
	ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//Import Actions
import Actions from '../actions/actions.js';

//Import components, functions, and styles
import Project from '../components/project.js';
import styles from '../styles/styles_main.js'; 

class Projects extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const projects = this.props.projects.map((item, index) => {
			return <Project item={item} key={index} />
		});

		return (
			<View style={styles.container}>
				<Text style={styles.welcome}>
					Projects
				</Text>
				<ScrollView>
					{projects}
				</ScrollView>
			</View>
		);
	}
}

function mapStateToProps(state) {
	return state;
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Projects);