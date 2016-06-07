import $ from 'jquery';
import NProgress from 'nprogress';

export const GET_ALL_ARTICLES = 'GET_ALL_ARTICLES';
export function getAllArticles (data) {
  return {
    type    : GET_ALL_ARTICLES,
    content : data
  };
}

export const CLEAR_ALL_ARTICLES = 'CLEAR_ALL_ARTICLES';
export function clearAllArticles (data) {
  return {
    type    : CLEAR_ALL_ARTICLES,
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

export const CLEAR_SELECTION = 'CLEAR_SELECTION';
export function clearSelection () {
  return { type: CLEAR_SELECTION };
}

// use fetch and return a promise
export function fetchAllArticles (args) {
  NProgress.start();
  return function (dispatch) {
    NProgress.set(0.4);
    $.get('/archive/all_articles', args, function (data) {
      NProgress.set(0.8);
      document.body.scrollTop = 0;
      dispatch(getAllArticles(data.content));
    });
  };
}

export function fetchSingleArticle (args) {
  NProgress.start();
  return function (dispatch) {
    NProgress.set(0.4);
    $.post('/archive/single_article', args, function (data) {
      NProgress.set(0.8);
      dispatch(getSingleArticle(data.article));
    });
  };
}
