import $ from 'jquery';
import NProgress from 'nprogress';

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

export const CLEAR_SELECTION = 'CLEAR_SELECTION';
export function clearSelection () {
  return {
    type: CLEAR_SELECTION
  };
}

// use fetch and return a promise
export function fetchAllArticles () {
  NProgress.set(0.4);
  return function (dispatch) {
    $.get('/archive/all_articles', {}, function (data) {
      NProgress.set(0.8);
      dispatch(getAllArticles(data.entities));
    });
  };
}

export function fetchSingleArticle (args) {
  NProgress.set(0.4);
  return function (dispatch) {
    $.get(`/archive/single_article?name=${args.name}`, {}, function (data) {
      NProgress.set(0.8);
      dispatch(getSingleArticle(data.article));
    });
  };
}