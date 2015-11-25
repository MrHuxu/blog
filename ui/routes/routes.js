import App from '../components/App';
import Home from '../components/Home';
import Archives from '../components/Archives';
import Article from '../components/Article';
import Projects from '../components/Projects';
import Aboutme from '../components/Aboutme';

export default {
  path: '/',
  component: App,
  childRoutes: [{
    path      : 'projects',
    component : Projects
  }, {
    path      : 'aboutme',
    component : Aboutme
  }, {
    path        : 'archives',
    component   : Archives,
    childRoutes : [{
      path      : ':articleName/show',
      component : Article
    }]
  }]
}