// Import libraries
import { AsyncStorage } from 'react-native';

// Import action types
import {
  UPDATE_FEEDBACK_TEXT,
  UPDATE_IMAGE_URL,
  UPDATE_CATEGORY,
  UPDATE_FEEDBACK_TYPE,
  UPDATE_ERROR_MESSAGE,
  ADD_FEEDBACK_TO_STATE,
  REQUESTED_FEEDBACK,
  RECEIVED_FEEDBACK,
  SUBMITTING_FEEDBACK,
  SUBMIT_FEEDBACK_SUCCESS,
  UPDATE_FEEDBACK_SUCCESS,
  SUBMIT_FEEDBACK_FAIL,
  UPDATE_FEEDBACK_FAIL,
  SUBMITTING_IMAGE,
  SUBMIT_IMAGE_SUCCESS,
  SUBMIT_IMAGE_FAIL,
  ADD_FEEDBACK_UPVOTE,
  ADD_FEEDBACK_DOWNVOTE,
  REMOVE_FEEDBACK_UPVOTE,
  REMOVE_FEEDBACK_DOWNVOTE,
  ADD_FEEDBACK_NO_OPINION,
  REMOVE_FEEDBACK_NO_OPINION,
  AUTHORIZE_USER_SUCCESS,
  AUTHORIZE_USER_FAIL,
  CHANGE_FILTER_METHOD,
  SET_SEARCH_QUERY,
  SEARCH_IN_PROGRESS,
  REMOVE_IMAGE,
  DELETE_FEEDBACK,
} from './types';

// Import constants
import { http, ROOT_STORAGE, ROOT_URL } from '../constants';

export const updateFeedbackText = feedback => ({
  type: UPDATE_FEEDBACK_TEXT,
  payload: feedback,
});

export const updateImageURL = imageURL => ({
  type: UPDATE_IMAGE_URL,
  payload: imageURL,
});

export const updateCategory = category => ({
  type: UPDATE_CATEGORY,
  payload: category,
});

export const updateFeedbackType = feedbackType => ({
  type: UPDATE_FEEDBACK_TYPE,
  payload: feedbackType,
});

export const updateErrorMessage = errorMessage => ({
  type: UPDATE_ERROR_MESSAGE,
  payload: errorMessage,
});

export const pullFeedback = token => (
  (dispatch) => {
    dispatch({ type: REQUESTED_FEEDBACK });

    http.post('/pullFeedback', { authorization: token })
    .then((response) => {
      dispatch({ type: AUTHORIZE_USER_SUCCESS, payload: token });
      dispatch({ type: RECEIVED_FEEDBACK, payload: { list: response.data, lastPulled: new Date() } });
    })
    .catch((error) => {
      const errorMessage = error.response ? error.response.data : error;
      console.log('Error in pullFeedback in actions_feedback', errorMessage);
      dispatch({ type: AUTHORIZE_USER_FAIL, payload: errorMessage });
    });
  }
);

export const submitFeedbackToServer = (feedbackRequiresApproval, text, type, imageURL, category) => (
  (dispatch, getState) => {
    dispatch({ type: SUBMITTING_FEEDBACK });

    const token = getState().auth.token;
    const userId = getState().user.userId;
    let feedback = { text, type, imageURL, category };

    http.post('/submitFeedback/', { feedback, authorization: token })
    .then((response) => {
      dispatch({ type: SUBMIT_FEEDBACK_SUCCESS });

      // Automatically upvote feedback the user submitted
      feedback = { ...feedback, userId, id: response.data.id, status: 'new', trendingScore: 1, upvotes: 0, downvotes: 0, noOpinions: 0, approved: !feedbackRequiresApproval, date: Date.now()};

      // Add to local state if no approval required
      if (!feedbackRequiresApproval) {
        dispatch({ type: ADD_FEEDBACK_TO_STATE, payload: feedback });
      }
      dispatch(addFeedbackUpvote(feedback));
    })
    .catch((error) => {
      console.log('Error running submitFeedbackToServer()');
      console.log('Error: ', error);
      dispatch({ type: SUBMIT_FEEDBACK_FAIL, payload: 'Something went wrong on our end. Please try again.' });
    });
  }
);

export const updateFeedbackToServer = (feedbackRequiresApproval, text, type, imageURL, category, originalFeedback) => (
  (dispatch, getState) => {
    dispatch({ type: SUBMITTING_FEEDBACK });

    const token = getState().auth.token;
    const feedback = { ...originalFeedback, text, type, imageURL, category, approved: !feedbackRequiresApproval };

    http.post('/updateFeedback/', { feedback, authorization: token })
    .then(() => dispatch({ type: UPDATE_FEEDBACK_SUCCESS, payload: feedback }))
    .catch((error) => {
      console.log('Error running updateFeedbackToServer()');
      console.log('Error: ', error);
      dispatch({ type: UPDATE_FEEDBACK_FAIL, payload: 'Something went wrong on our end. Please try again.' });
    });
  }
);

export const addFeedbackUpvote = feedback => (
  (dispatch, getState) => {
    dispatch({ type: ADD_FEEDBACK_UPVOTE, payload: feedback });

    const { feedbackUpvotes, feedbackDownvotes, feedbackNoOpinions } = getState().user;
    AsyncStorage.setItem(`${ROOT_STORAGE}feedbackUpvotes`, JSON.stringify(feedbackUpvotes));

    // If downvote exists remove it
    if (feedbackDownvotes.includes(feedback.id)) {
      dispatch(removeFeedbackDownvote(feedback));
    }
    if (feedbackNoOpinions.includes(feedback.id)) {
      dispatch(removeFeedbackNoOpinion(feedback));
    }

    const token = getState().auth.token;
    http.post('/submitFeedbackVote', { feedback, upvote: 1, downvote: 0, noOpinion: 0, authorization: token })
    .catch((error) => {
      const errorMessage = error.response ? error.response.data : error;
      console.log('Error in addFeedbackUpvote in actions_feedback', errorMessage);
    });
  }
);

export const removeFeedbackUpvote = feedback => (
  (dispatch, getState) => {
    dispatch({ type: REMOVE_FEEDBACK_UPVOTE, payload: feedback });
    const { feedbackUpvotes } = getState().user;
    AsyncStorage.setItem(`${ROOT_STORAGE}feedbackUpvotes`, JSON.stringify(feedbackUpvotes));

    const token = getState().auth.token;
    http.post('/removeFeedbackVote', { feedback, upvote: 1, downvote: 0, noOpinion: 0, authorization: token })
    .catch((error) => {
      const errorMessage = error.response ? error.response.data : error;
      console.log('Error in removeFeedbackUpvote in actions_feedback', errorMessage);
    });
  }
);

export const addFeedbackNoOpinion = feedback => (
  (dispatch, getState) => {
    dispatch({ type: ADD_FEEDBACK_NO_OPINION, payload: feedback });
    const { feedbackUpvotes, feedbackDownvotes, feedbackNoOpinions } = getState().user;
    AsyncStorage.setItem(`${ROOT_STORAGE}feedbackNoOpinions`, JSON.stringify(feedbackNoOpinions));

    // If downvote exists remove it
    if (feedbackDownvotes.includes(feedback.id)) {
      dispatch(removeFeedbackDownvote(feedback));
    }

    // If upvote exists remove it
    if (feedbackUpvotes.includes(feedback.id)) {
      dispatch(removeFeedbackUpvote(feedback));
    }

    const token = getState().auth.token;
    http.post('/submitFeedbackVote', { feedback, noOpinion: 1, upvote: 0, downvote: 0, authorization: token })
    .catch((error) => {
      const errorMessage = error.response ? error.response.data : error;
      console.log('Error in addFeedbackNoOpinion in actions_feedback', errorMessage);
    });
  }
);

export const removeFeedbackNoOpinion = feedback => (
  (dispatch, getState) => {
    dispatch({ type: REMOVE_FEEDBACK_NO_OPINION, payload: feedback });
    const { feedbackNoOpinions } = getState().user;
    AsyncStorage.setItem(`${ROOT_STORAGE}feedbackNoOpinions`, JSON.stringify(feedbackNoOpinions));

    const token = getState().auth.token;
    http.post('/removeFeedbackVote', { feedback, noOpinion: 1, upvote: 0, downvote: 0, authorization: token })
    .catch((error) => {
      const errorMessage = error.response ? error.response.data : error;
      console.log('Error in removeFeedbackNoOpinion in actions_feedback', errorMessage);
    });
  }
);

export const addFeedbackDownvote = feedback => (
  (dispatch, getState) => {
    dispatch({ type: ADD_FEEDBACK_DOWNVOTE, payload: feedback });
    const { feedbackDownvotes, feedbackUpvotes, feedbackNoOpinions } = getState().user;
    AsyncStorage.setItem(`${ROOT_STORAGE}feedbackDownvotes`, JSON.stringify(feedbackDownvotes));

    // If upvote exists remove it
    if (feedbackUpvotes.includes(feedback.id)) {
      dispatch(removeFeedbackUpvote(feedback));
    }
    if (feedbackNoOpinions.includes(feedback.id)) {
      dispatch(removeFeedbackNoOpinion(feedback));
    }

    const token = getState().auth.token;
    http.post('/submitFeedbackVote', { feedback, upvote: 0, downvote: 1, noOpinion: 0, authorization: token })
    .catch((error) => {
      const errorMessage = error.response ? error.response.data : error;
      console.log('Error in addFeedbackDownvote in actions_feedback', errorMessage);
    });
  }
);

export const removeFeedbackDownvote = feedback => (
  (dispatch, getState) => {
    dispatch({ type: REMOVE_FEEDBACK_DOWNVOTE, payload: feedback });
    const { feedbackDownvotes } = getState().user;
    AsyncStorage.setItem(`${ROOT_STORAGE}feedbackDownvotes`, JSON.stringify(feedbackDownvotes));

    const token = getState().auth.token;
    http.post('/removeFeedbackVote', { feedback, upvote: 0, downvote: 1, noOpinion: 0, authorization: token })
    .catch((error) => {
      const errorMessage = error.response ? error.response.data : error;
      console.log('Error in removeFeedbackDownvote in actions_feedback', errorMessage);
    });
  }
);

export const searchInProgress = bool => (
  {
    type: SEARCH_IN_PROGRESS,
    payload: bool,
  }
);

export const changeFilterMethod = method => (
  {
    type: CHANGE_FILTER_METHOD,
    payload: method,
  }
);

export const setSearchQuery = query => (
  {
    type: SET_SEARCH_QUERY,
    payload: query,
  }
);

export const uploadImage = (uri, type) => (
  (dispatch) => {
    dispatch({ type: SUBMITTING_IMAGE });
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
    .then(imageURL => dispatch({ type: SUBMIT_IMAGE_SUCCESS, payload: imageURL }))
    .catch((error) => {
      const errorMessage = error.response ? error.response.data : error;

      dispatch({ type: SUBMIT_IMAGE_FAIL });
      alert("I'm sorry. The server is experiencing an error. Error message: ", errorMessage);
    });
  }
);

export const removeImage = () => (
  {
    type: REMOVE_IMAGE,
  }
);

export const deleteFeedback = feedback1 => (
  (dispatch, getState) => {
    //
    const token = getState().auth.token;
    let feedback = { ...feedback1, status: 'deleted' };

    http.post('/updateFeedback/', { feedback, authorization: token })
    .then((response) => {
      dispatch({ type: DELETE_FEEDBACK, payload: feedback1 });
    })
    .catch((error) => {
      const errorMessage = error.response ? error.response.data : error;
      console.log('Error in deleteFeedback in actions_feedback', error);
      dispatch({ type: UPDATE_FEEDBACK_FAIL, payload: errorMessage });
    });
  }
);
