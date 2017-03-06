'use strict';

//Import Libraries
import React, { Component } from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { connect } from 'react-redux';

//Import componenets, functions, and styles
import styles from '../styles/project_details_styles.js';
import { addUpvote, removeUpvote } from '../actions';
import { Button, Card, CardSection } from '../components/common';

class ProjectDetails extends Component {
	upvote() {
		const { user } = this.props;
		const { project } = this.props.navigation.state.params;
		// If user hasn't upvoted this project, add an upvote
		if (!user.upvotes.includes(project.id)) {
			this.props.addUpvote(project);
		} else {
			this.props.removeUpvote(project);
		}
	}

	projectDescription() {
		const { buttonText, lowWeight } = styles;
		const { project } = this.props.navigation.state.params;

		return (
			<View style={{ justifyContent: 'flex-start' }}>
				{/* Project title */}
				<Text style={buttonText}>
					{project.title}
				</Text>

				{/* Vote section */}
				<View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 5 }}>
					{/* Vote count */}
					<View style={{ flex: 3 }}>
						<Text style={[buttonText, lowWeight]}>
							{`${project.votes} Votes`}
						</Text>
					</View>

					{/* Upvote button */}
					<View style={{ flex: 1 }}>
						{this.renderButton()}
					</View>
				</View>
			</View>
		);
	}

	renderButton() {
		const { user } = this.props;
		const { project } = this.props.navigation.state.params;
		let buttonStyles = { width: 80, height: 27, marginRight: 2 };
		let textStyles = { paddingTop: 10, paddingBottom: 10 };
		// If user hasn't upvoted this project
		if (user.upvotes.includes(project.id)) {
			buttonStyles = { ...buttonStyles, backgroundColor: '#007aff' };
			textStyles = { ...textStyles, color: '#fff' };
		}
		return (
			<Button
				onPress={this.upvote.bind(this)}
				style={buttonStyles}
				textStyle={textStyles}
			>
				Upvote!
			</Button>
		);
	}

	render() {
		const { container, text, inputText } = styles;
		return (
			<TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
				<View style={container}>

					<Card>
						<CardSection>
							{this.projectDescription()}
						</CardSection>
					</Card>

					<Card>
						<CardSection>
							<Text style={text}>Suggested solutions:</Text>
						</CardSection>
					</Card>

					<TextInput
						style={inputText}
						placeholder='Submit a suggestion'
					/>

				</View>
			</TouchableWithoutFeedback>
		);
	}
}

function mapStateToProps(state) {
	const { user } = state;
	return { user };
}

const AppScreen = connect(mapStateToProps, { addUpvote, removeUpvote })(ProjectDetails);

AppScreen.navigationOptions = {
	title: 'Project Details'
};

export default AppScreen;
