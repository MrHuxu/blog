import {
  GET_ALL_ARTICLES,
  CLEAR_ALL_ARTICLES,
  GET_SINGLE_ARTICLE,
  CLEAR_SELECTION
} from '../actions/ArchiveActions';
import NProgress from 'nprogress';

export function archive (state = {
  page            : 0,
  perPage         : 0,
  pageCount       : 0,
  entities        : [],
  selectedArticle : {}
}, action) {
  var copy = Object.assign({}, state);

  switch (action.type) {
    case GET_ALL_ARTICLES:
      NProgress.done();
      return Object.assign(copy, {
        page      : action.content.page,
        perPage   : action.content.perPage,
        pageCount : action.content.pageCount,
        entities  : action.content.articles
      });

    case CLEAR_ALL_ARTICLES:
      return Object.assign(copy, {
        page      : 0,
        perPage   : 0,
        pageCount : 0,
        entities  : []
      });

    case GET_SINGLE_ARTICLE:
      NProgress.done();
      copy.selectedArticle = action.content;
      return copy;

    case CLEAR_SELECTION:
      copy.selectedArticle = {};
      return copy;

    default:
      return state;
  }
};