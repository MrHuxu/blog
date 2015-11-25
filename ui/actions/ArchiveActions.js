import $ from 'jquery';

export const GET_ALL_ARTICLES = 'GET_ALL_ARTICLES';
export function getAllArticles (data) {
  return {
    type    : GET_ALL_ARTICLES,
    content : data
  };
}

export const GET_SINGLE_ARTICLE = 'GET_SINGLE_ARTICLE';
export function getSingleArticle (data) {
  return {
    type    : GET_SINGLE_ARTICLE,
    content : data
  };
}

// use fetch and return a promise
export function fetchAllArticles () {
  return function (dispatch) {
    $.get('/archives/all_articles', {}, function (data) {
      dispatch(getAllArticles(data.entities));
    })
  }
}

export function fetchSingleArticle (args) {
  $
}