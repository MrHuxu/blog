import {
  GET_ALL_ARTICLES,
  GET_SINGLE_ARTICLE,
  CLEAR_SELECTION,
  CHANGE_PAGE
} from '../actions/ArchiveActions';
import NProgress from 'nprogress';

export function archive (state = {
  entities   : [],
  pagination : {
    page      : 0,
    perPage   : 5,
    pageCount : 0
  },
  selectedArticle : {}
}, action) {
  switch (action.type) {
    case GET_ALL_ARTICLES:
      NProgress.done();
      return Object.assign({}, {
        entities   : action.content,
        pagination : Object.assign({}, {
          page      : state.pagination.page,
          perPage   : state.pagination.perPage,
          pageCount : Math.ceil(action.content.length / state.pagination.perPage)
        }),
        selectedArticle : state.selectedArticle
      });

    case GET_SINGLE_ARTICLE:
      NProgress.done();
      return Object.assign({}, {
        entities        : state.entities,
        pagination      : state.pagination,
        selectedArticle : action.content
      });

    case CLEAR_SELECTION:
      return Object.assign({}, {
        entities        : state.entities,
        pagination      : state.pagination,
        selectedArticle : {}
      });

    case CHANGE_PAGE:
      return Object.assign({}, {
        entities   : state.entities,
        pagination : Object.assign({}, {
          page      : action.content,
          perPage   : state.pagination.perPage,
          pageCount : state.pagination.pageCount
        }),
        selectedArticle : state.selectedArticle
      })

    default:
      return state;
  }
};