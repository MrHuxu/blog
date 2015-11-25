import { GET_ALL_ARTICLES, GET_SINGLE_ARTICLE } from '../actions/ArchiveActions';

export function archive (state = {
  entities: []
}, action) {
  switch (action.type) {
    case GET_ALL_ARTICLES:
      return Object.assign({}, {
        entities: action.content
      });

    default:
      return state;
  }
};