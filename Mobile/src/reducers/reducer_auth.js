// Import action types
import {
  SENDING_AUTHORIZATION_EMAIL,
  SENT_AUTHORIZATION_EMAIL_SUCCESS,
  SENT_AUTHORIZATION_EMAIL_FAIL,
  AUTHORIZING_USER,
  VERIFYING_EMAIL,
  AUTHORIZE_USER_SUCCESS,
  AUTHORIZE_USER_FAIL,
  LOG_OUT_USER,
  UPDATE_NEEDS_GROUP_CODE,
  UPDATE_AUTH_CODE,
} from '../actions/types';

const INITIAL_STATE = {
  email: '',
  token: null,
  loading: false,
  code: '',
  sentAuthorizationEmail: false,
  emailVerified: false,
  error: null,
  loggedIn: null,
  needsGroupCode: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SENDING_AUTHORIZATION_EMAIL:
      return { ...state, loading: true, loggedIn: false, code: '', emailVerified: false };
    case SENT_AUTHORIZATION_EMAIL_SUCCESS:
      return { ...state, loading: false, sentAuthorizationEmail: true, error: false, email: action.payload, emailVerified: true };
    case SENT_AUTHORIZATION_EMAIL_FAIL:
      return { ...state, loading: false, sentAuthorizationEmail: false, error: action.payload, emailVerified: false };
    case AUTHORIZING_USER:
      return { ...state, loading: true };
    case VERIFYING_EMAIL:
      return { ...state, loading: true, loggedIn: false };
    case AUTHORIZE_USER_SUCCESS:
      return { ...state, loading: false, sentAuthorizationEmail: false, loggedIn: true, token: action.payload, error: false };
    case AUTHORIZE_USER_FAIL:
      return { ...state, loading: false, loggedIn: false, error: action.payload };
    case UPDATE_NEEDS_GROUP_CODE:
      return { ...state, loading: false, needsGroupCode: action.payload };
    case UPDATE_AUTH_CODE:
      return { ...state, code: action.payload };
    case LOG_OUT_USER:
      return INITIAL_STATE;
    default:
      return state;
  }
};
