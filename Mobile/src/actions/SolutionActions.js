'use strict';

// Import libraries
import axios from 'axios';

// Import action types
import {
	RECEIVED_SOLUTION_LIST,
	SOLUTION_CHANGED,
	SUBMIT_SOLUTION,
	SUBMIT_SOLUTION_SUCCESS,
	SUBMIT_SOLUTION_FAIL
} from './types';

// Import constants
import { ROOT_URL } from '../constants';

export const solutionChanged = (solution) => (
	{
		type: SOLUTION_CHANGED,
		payload: solution
	}
);

export const submitSolutionToServer = (solution, projectId) => (
	function (dispatch, getState) {
		const token = getState().auth.token;

		dispatch({ type: SUBMIT_SOLUTION });
		return axios.post(`${ROOT_URL}/addSolution`, { description: solution, projectId, authorization: token })
			.then(() => {
				dispatch({ type: SUBMIT_SOLUTION_SUCCESS });
			})
			.catch((err) => {
				dispatch({ type: SUBMIT_SOLUTION_FAIL });
				console.error('submitSolutionToServer() ERROR: ', err);
			});
	}
);

export const pullSolutions = (token) => (
	function (dispatch) {
		return axios.post(`${ROOT_URL}/pullProjectAdditions`, { authorization: token })
		.then(response => {
			dispatch(receivedSolutionList(response.data));
		})
		.catch(error => {
			console.error('pullSolutions() ERROR: ', error);
		});
	}
);

export const receivedSolutionList = (solutions) => ({
	type: RECEIVED_SOLUTION_LIST,
	payload: solutions
});
