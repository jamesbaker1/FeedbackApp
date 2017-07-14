// Import action types
import {
  PULL_GROUP_INFO,
  LOAD_DO_NOT_DISPLAY_LIST,
  LOAD_INSTRUCTIONS_VIEWED,
  LOAD_FEEDBACK_UPVOTES,
  LOAD_FEEDBACK_DOWNVOTES,
  LOAD_FEEDBACK_NO_OPINIONS,
  LOAD_SOLUTION_UPVOTES,
  LOAD_SOLUTION_DOWNVOTES,
  ADD_TO_DO_NOT_DISPLAY_LIST,
  ADD_TO_INSTRUCTIONS_VIEWED,
  ADD_FEEDBACK_UPVOTE,
  ADD_FEEDBACK_DOWNVOTE,
  ADD_FEEDBACK_NO_OPINION,
  ADD_SOLUTION_UPVOTE,
  ADD_SOLUTION_DOWNVOTE,
  REMOVE_FEEDBACK_UPVOTE,
  REMOVE_FEEDBACK_DOWNVOTE,
  REMOVE_FEEDBACK_NO_OPINION,
  REMOVE_SOLUTION_UPVOTE,
  REMOVE_SOLUTION_DOWNVOTE,
  LOG_OUT_USER,
  CHANGE_LANGUAGE_CHOICE,
} from '../actions/types';

const INITIAL_STATE = {
  userId: 0,
  doNotDisplayList: [],
  instructionsViewed: [],
  feedbackUpvotes: [],
  feedbackDownvotes: [],
  solutionUpvotes: [],
  solutionDownvotes: [],
  feedbackNoOpinions: [],
  language: 'en',
};

const removeItem = (arr, item) => {
  const index = arr.indexOf(item);
  if (index !== -1) {
    return [...arr.slice(0, index), ...arr.slice(index + 1)];
  }
  return arr;
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PULL_GROUP_INFO:
      return { ...state, userId: action.payload.userId, language: action.payload.language};
    case CHANGE_LANGUAGE_CHOICE:
      console.log(action.payload, 'in change_language_choice')
      return { ...state, language: action.payload };
    case LOAD_DO_NOT_DISPLAY_LIST:
      return { ...state, doNotDisplayList: action.payload };
    case LOAD_INSTRUCTIONS_VIEWED:
      return { ...state, instructionsViewed: action.payload };
    case LOAD_FEEDBACK_UPVOTES:
      return { ...state, feedbackUpvotes: action.payload };
    case LOAD_FEEDBACK_DOWNVOTES:
      return { ...state, feedbackDownvotes: action.payload };
    case LOAD_FEEDBACK_NO_OPINIONS:
      return { ...state, feedbackNoOpinions: action.payload };
    case LOAD_SOLUTION_UPVOTES:
      return { ...state, solutionUpvotes: action.payload };
    case LOAD_SOLUTION_DOWNVOTES:
      return { ...state, solutionDownvotes: action.payload };
    case ADD_TO_DO_NOT_DISPLAY_LIST:
      return { ...state, doNotDisplayList: [...state.doNotDisplayList, action.payload] };
    case ADD_TO_INSTRUCTIONS_VIEWED:
      return { ...state, instructionsViewed: [...state.instructionsViewed, action.payload] };
    case ADD_FEEDBACK_UPVOTE:
      return { ...state, feedbackUpvotes: [...state.feedbackUpvotes, action.payload.id] };
    case ADD_FEEDBACK_DOWNVOTE:
      return { ...state, feedbackDownvotes: [...state.feedbackDownvotes, action.payload.id] };
    case ADD_FEEDBACK_NO_OPINION:
      return { ...state, feedbackNoOpinions: [...state.feedbackNoOpinions, action.payload.id] };
    case ADD_SOLUTION_UPVOTE:
      return { ...state, solutionUpvotes: [...state.solutionUpvotes, action.payload.id] };
    case ADD_SOLUTION_DOWNVOTE:
      return { ...state, solutionDownvotes: [...state.solutionDownvotes, action.payload.id] };
    case REMOVE_FEEDBACK_UPVOTE:
      return { ...state, feedbackUpvotes: removeItem(state.feedbackUpvotes, action.payload.id) };
    case REMOVE_FEEDBACK_DOWNVOTE:
      return { ...state, feedbackDownvotes: removeItem(state.feedbackDownvotes, action.payload.id) };
    case REMOVE_FEEDBACK_NO_OPINION:
      return { ...state, feedbackNoOpinions: removeItem(state.feedbackNoOpinions, action.payload.id) };
    case REMOVE_SOLUTION_UPVOTE:
      return { ...state, solutionUpvotes: removeItem(state.solutionUpvotes, action.payload.id) };
    case REMOVE_SOLUTION_DOWNVOTE:
      return { ...state, solutionDownvotes: removeItem(state.solutionDownvotes, action.payload.id) };
    case LOG_OUT_USER:
      return INITIAL_STATE;
    default:
      return state;
  }
};
