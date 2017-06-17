// Import action types
import {
  SAVE_PROJECT_CHANGES,
  REQUESTED_PROJECTS,
  RECEIVED_PROJECTS,
  AUTHORIZE_USER_SUCCESS,
  AUTHORIZE_USER_FAIL,
  ADD_PROJECT,
  SUBMIT_IMAGE,
  SUBMIT_IMAGE_SUCCESS,
  SUBMIT_IMAGE_FAIL,
} from './types';

// Import constants
import { http, ROOT_URL } from '../constants';

export const requestedProjects = () => ({
  type: REQUESTED_PROJECTS,
});

export const receivedProjects = projectsList => ({
  type: RECEIVED_PROJECTS,
  payload: { list: projectsList, lastPulled: new Date() },
});

export const pullProjects = token => (
  (dispatch) => {
    dispatch(requestedProjects());

    http.post('/pullProjects', { authorization: token })
    .then((response) => {
      dispatch({ type: AUTHORIZE_USER_SUCCESS, payload: token });
      dispatch(receivedProjects(response.data));
    })
    .catch((error) => {
      console.log('Error in pullProjects in actions_projects', error.response.data);
      dispatch({ type: AUTHORIZE_USER_FAIL, payload: error.response.data });
    });
  }
);

export const saveProjectChanges = (project, changeType) => (
  (dispatch, getState) => {
    dispatch({ type: SAVE_PROJECT_CHANGES, payload: project });

    const { token } = getState().auth;

    // Save the project change to the server
    http.post('/saveProjectChanges/', { project, authorization: token })
    .catch((error) => {
      console.log('Error in saveProjectChanges in actions_projects', error.response.data);
    });

    // Subscribe the user to the project
    http.post('/addSubscriber', { authorization: token, projectId: project.id, type: changeType })
    .catch((error) => {
      console.log('Error in addSubscriber in actions_projects', error.response.data);
    });
  }
);

export const addProject = (feedback, type, feedbackId) => (
  (dispatch, getState) => {
    const feedbackObject = { text: feedback, type, id: feedbackId };
    http.post('/addProject/', { feedback: feedbackObject, authorization: getState().auth.token })
    .then((response) => {
      dispatch({ type: ADD_PROJECT, payload: { title: feedback, type, id: response.data.id } });
    })
    .catch((error) => {
      console.log('Error in addProject in actions_projects', error.response.data);
    });
  }
);

export const uploadImage = uri => (
  (dispatch) => {
    dispatch({ type: SUBMIT_IMAGE });
    const apiUrl = `${ROOT_URL}/uploadPhoto/`;
    const fileType = uri[uri.length - 1];

    const formData = new FormData();
    formData.append('photo', {
      uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    });

    const options = {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    };

    fetch(apiUrl, options)
    .then(response => response.json())
    .then(response => dispatch({ type: SUBMIT_IMAGE_SUCCESS, payload: response.location }))
    .catch((err) => {
      dispatch({ type: SUBMIT_IMAGE_FAIL });
      alert('Uh-oh, something went wrong :(\nPlease try again.');
      console.log('Error uploading image');
      console.log('Error: ', err);
    });
  }
);
