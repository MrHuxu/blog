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
  constructor (props) {
    super(props);

    this.generateItem = this.generateItem.bind(this);
  }

  generateItem (project) {
    return (
      <Card style = {style.card}>
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

  componentWillMount () {
    this.props.dispatch(clearAllArticles());
  }

  componentDidMount () {
    if (!this.props.projects.length) {
      if ($('.blog-sidebar').css('display') === 'none' || $('.home-item').hasClass('animated')) {
        this.props.dispatch(fetchRepos());
      } else {
        $('.home-item').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
          this.props.dispatch(fetchRepos());
        });
      }
    }
  }

  render () {
    const { projects } = this.props;
    document.title = 'Life of xhu - Projects';

    var projectItems = projects.map(project => this.generateItem(project));

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
