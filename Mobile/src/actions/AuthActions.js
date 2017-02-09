'use strict';

// Import Libraries
import firebase from 'firebase';

// Import types
import {
	EMAIL_CHANGED,
	PASSWORD_CHANGED,
	PASSWORD_CONFIRM_CHANGED,
	SIGNUP_USER,
	SIGNUP_USER_FAIL
} from './types';

export const emailChanged = (email) => (
	{
		type: EMAIL_CHANGED,
		payload: email
	}
);

export const passwordChanged = (password) => (
	{
		type: PASSWORD_CHANGED,
		payload: password
	}
);

export const passwordConfirmChanged = (passwordConfirm) => (
	{
		type: PASSWORD_CONFIRM_CHANGED,
		payload: passwordConfirm
	}
);

export const signupUser = ({ email, password }) => (
	(dispatch) => {
		// To do: Add reducer that uses SIGNUP_USER
		dispatch({ type: SIGNUP_USER });

		firebase.auth().createUserWithEmailAndPassword(email, password)
			.then((res) => {
				console.log('Signup successful');
				console.log('Response: ', res);
				// To do: Dispatch action confirming successful signup
				// To do: Navigate away after success
			})
			.catch(() => {
				dispatch({ type: SIGNUP_USER_FAIL, payload: 'Email address is already in use' });
			});
	}
);

export const signupUserFail = (err) => (
	{
		type: SIGNUP_USER_FAIL,
		payload: err
	}
);
