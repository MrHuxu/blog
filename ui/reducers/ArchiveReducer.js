import {
  GET_ALL_ARTICLES,
  GET_SINGLE_ARTICLE,
  CLEAR_SELECTION
} from '../actions/ArchiveActions';
import NProgress from 'nprogress';

export function archive (state = {
  entities   : [],
  selectedArticle : {}
}, action) {
  switch (action.type) {
    case GET_ALL_ARTICLES:
      NProgress.done();
      return Object.assign({}, {
        entities   : action.content,
        selectedArticle : state.selectedArticle
      });

    case GET_SINGLE_ARTICLE:
      NProgress.done();
      return Object.assign({}, {
        entities        : state.entities,
        selectedArticle : action.content
      });

    case CLEAR_SELECTION:
      return Object.assign({}, {
        entities        : state.entities,
        selectedArticle : {}
      });

    default:
      return state;
  }
};