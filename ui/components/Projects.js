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
    const projectStyle = {
      description: {
        marginTop    : '3px',
        marginBottom : '0',
        fontSize     : '15px',
        color        : '#666',
        fontFamily   : '"Open Sans","Helvetica Neue",Arial,NanumBarunGothic,"Apple SD Gothic Neo",AppleGothic,"Malgun Gothic",DotumChe,sans-serif'
      },

      time: {
        marginTop  : '5px',
        fontSize   : '13px',
        color      : '#888',
        fontFamily : '"Open Sans","Helvetica Neue",Arial,NanumBarunGothic,"Apple SD Gothic Neo",AppleGothic,"Malgun Gothic",DotumChe,sans-serif'
      }
    };

    return (
      <div key={project.name} className='item'>
        <i className='large github middle aligned icon'></i>
        <div className='content'  style={{width: '100%'}}>
          <div className='ui grid'>
            <div className='eight wide column'>
              <a target='_blank' href={project.url} className='header'>{project.fullName}</a>
            </div>
            <div className='eight wide right aligned column' style={{paddingRight: '45px'}}>
              <i className="star icon">
                <span style={projectStyle.description}>&nbsp;{project.star}</span>
              </i>
            </div>
          </div>
          <div style={projectStyle.description}>{project.description}</div>
          <div style={projectStyle.time}>Updated at {project.updatedAt}</div>
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
    document.title = 'Life of xhu - Projects';

    var projectItems = projects.map(project => this.generateItem(project));

    return (
      <div className='ui segment'>
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