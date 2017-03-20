//Import Libraries
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router';

//Import Views
import Container from './components/container.js';
import Feedback from './components/feedback.js';
import Projects from './components/projects.js';

//Import Store
import store, { history } from './reducers/store.js';

ReactDOM.render(
	<Provider store={store}>
		<Router history={hashHistory}>
      <Route path='/' component={Container}>
        <IndexRoute component={Projects} />
        <Route path='/projects/:stage' component={Projects} />
        <Route path='/feedback' component={Feedback} />
      </Route>
 		</Router>		
	</Provider>
	, document.querySelector('.app'));
