import thunkMiddleware from 'redux-thunk';
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import { archive } from './reducers/ArchiveReducer';
import { project } from './reducers/ProjectReducer';

const rootReducer = combineReducers({
  archive,
  project
});

export const rootStore = compose(
  applyMiddleware(thunkMiddleware)
)(createStore)(rootReducer);
