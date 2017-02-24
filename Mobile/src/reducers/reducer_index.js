'use strict';

// Import Libraries
import { combineReducers } from 'redux';

// Import reducers
import main from './reducer_main';
import navigation from './reducer_navigation';
import projects from './reducer_projects';
import auth from './auth_reducer';
import user from './user_reducer';

export default combineReducers({
	main,
	navigation,
	projects,
	auth,
	user
});
