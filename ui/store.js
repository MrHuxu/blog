import thunkMiddleware from 'redux-thunk';
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import { archive } from './reducers/ArchiveReducer';
import createHistory from 'history/lib/createBrowserHistory';
import { reduxReactRouter, routerStateReducer } from 'redux-router';

const rootReducer = combineReducers({
  archive
});

export const rootStore = compose(
  applyMiddleware(thunkMiddleware),
  reduxReactRouter({ createHistory })
)(createStore)(rootReducer);