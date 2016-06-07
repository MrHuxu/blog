import App from '../components/App.jsx';
import Home from '../components/Home.jsx';
import Archives from '../components/Archives.jsx';
import Post from '../components/Post.jsx';
import Projects from '../components/Projects.jsx';
import Aboutme from '../components/Aboutme.jsx';

export default {
  path        : '/',
  component   : App,
  childRoutes : [{
    path      : 'page/:page',
    component : Home
  }, {
    path      : 'projects',
    component : Projects
  }, {
    path      : 'aboutme',
    component : Aboutme
  }, {
    path      : 'archives',
    component : Archives
  }, {
    path      : 'post/:articleName',
    component : Post
  }]
};
