import { GET_REPOS } from '../actions/ProjectActions';
import NProgress from 'nprogress';

export function project (state = {
  entities   : []
}, action) {
  switch (action.type) {
    case GET_REPOS:
      NProgress.done();
      return Object.assign({}, {
        entities: action.content
      });

    default:
      return state;
  }
};