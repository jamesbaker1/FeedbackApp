// Import Libraries
import React, { Component } from 'react';
import { Text, View, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';

// Import components and action creators
import { Card, CardSection, Input, Button, Spinner, Header } from '../components/common';
import { sendAuthorizationEmail, authorizeUserFail } from '../actions';
import styles from '../styles/styles_main';

class SendAuthorizationEmail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
    };
  }

  onButtonPress() {
    const re = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)*(?:hbs\.edu|stanford\.edu)$/;
    if (re.test(this.state.email)) {
      this.props.sendAuthorizationEmail(this.state.email);
    } else {
      this.props.authorizeUserFail('Invalid Email Address');
    }
  }

  renderSignupButton() {
    return (
      <Button onPress={this.onButtonPress.bind(this)}>
        Send Authorization Email
      </Button>
    );
  }

  renderButtons() {
    if (this.props.loading) {
      return <Spinner />;
    }

    return (
      <View style={{ flex: 1 }}>
        {this.renderSignupButton()}
      </View>
    );
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <Card>
            {/* Email input */}
            <CardSection>
              <Input
                label="School Email"
                placeholder="joe@university.edu"
                value={this.state.email}
                onChangeText={text => this.setState({ email: text })}
              />
            </CardSection>

            {/* Error message (blank if no error) */}
            <Text style={styles.errorTextStyle}>
              {this.props.error}
            </Text>

            {/* Confirmation button, and 'go to login' button */}
            <CardSection>
              {this.renderButtons()}
            </CardSection>

            <CardSection>
              <Text style={styles.text}>
                  Why do we need your email? Two reasons:{'\n'}
                  1) We need to confirm you are member of your university{'\n'}
                  2) We will keep you updated as changes are made based on your feedback
              </Text>
            </CardSection>
          </Card>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

SendAuthorizationEmail.propTypes = {
  error: React.PropTypes.oneOf([true, false, null]),
  loading: React.PropTypes.oneOf([true, false, null]),
  sendAuthorizationEmail: React.PropTypes.func,
  authorizeUserFail: React.PropTypes.func,
};

const mapStateToProps = (state) => {
  const { error, loading } = state.auth;
  return { error, loading };
};

export default connect(mapStateToProps, {
  sendAuthorizationEmail,
  authorizeUserFail,
})(SendAuthorizationEmail);
