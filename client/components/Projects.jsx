import $ from 'jquery';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { clearAllArticles } from '../actions/ArchiveActions';
import { fetchRepos } from '../actions/ProjectActions';

const style = {
  projects : {
    padding : '0 0 20px 0'
  },

  card : {
    margin : '15px 0 0 0'
  }
};

class Projects extends Component {
  static propTypes = {
    dispatch : React.PropTypes.func.isRequired,
    projects : React.PropTypes.arrayOf(React.PropTypes.shape({
      url         : React.PropTypes.string.isRequired,
      fullName    : React.PropTypes.string.isRequired,
      updatedAt   : React.PropTypes.string.isRequired,
      description : React.PropTypes.string.isRequired
    })).isRequired
  };

  constructor (props) {
    super(props);

    this.generateItem = this.generateItem.bind(this);
  }

  componentWillMount () {
    this.props.dispatch(clearAllArticles());
  }

  componentDidMount () {
    if (!this.props.projects.length) {
      if ('none' === $('.blog-sidebar').css('display') || $('.home-item').hasClass('animated')) {
        this.props.dispatch(fetchRepos());
      } else {
        $('.home-item').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
          this.props.dispatch(fetchRepos());
        });
      }
    }
  }

  generateItem (project, key) {
    return (
      <Card style = {style.card} key = {key}>
        <CardHeader
          title = {<a target = '_blank' href = {project.url} className = 'header'>{project.fullName}</a>}
          subtitle = {project.updatedAt}
          actAsExpander
          showExpandableButton
        />
        <CardText expandable>
          {project.description}
        </CardText>
      </Card>
    );
  }

  render () {
    const { projects } = this.props;
    document.title = 'Life of xhu - Projects';

    var projectItems = projects.map((project, index) => this.generateItem(project, index));

    return (
      <div style = {style.projects}>
        {projectItems}
      </div>
    );
  }
}

var mapStateToProps = function (state) {
  return {
    projects : state.project.entities
  };
};

export default connect(mapStateToProps)(Projects);
