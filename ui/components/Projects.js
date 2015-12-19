import $ from 'jquery';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchRepos } from '../actions/ProjectActions';

class Projects extends Component {
  constructor (props) {
    super(props);

    this.generateItem = this.generateItem.bind(this);
  }

  generateItem (project) {
    return (
      <div className='item'>
        <i className='large github middle aligned icon'></i>
        <div className='content'>
          <a target='_blank' href={project.url} className='header'>{project.fullName}</a>
          <div className='description'>Updated at {project.updatedAt}</div>
        </div>
      </div>
    );
  }

  componentDidMount () {
    if (!this.props.projects.length) {
      if ($('.home-item').hasClass('animated')) {
        this.props.dispatch(fetchRepos());
      } else {
        $('.home-item').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
          this.props.dispatch(fetchRepos());
        })
      }
    }
  }

  render () {
    const { projects } = this.props;

    var projectItems = projects.map(project => this.generateItem(project));

    return (
      <div className='ui segment'>
        <h3 className='widget-title'>Projects</h3>
        <div className='ui relaxed divided list'>
          {projectItems}
        </div>
      </div>
    );
  }
}

var mapStateToProps = function (state) {
  return {
    projects : state.project.entities
  };
}

export default connect(mapStateToProps)(Projects);