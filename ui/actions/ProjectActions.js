import $ from 'jquery';
import NProgress from 'nprogress';

export const GET_REPOS = 'GET_REPOS';
export function getRepos (data) {
  return {
    type: GET_REPOS,
    content: data
  };
};

export function fetchRepos () {
  NProgress.set(0.4);
  return function (dispatch) {
    $.get('/project/repos', {}, function (data) {
      NProgress.set(0.8);
      dispatch(getRepos(data.entities));
    });
  };
};