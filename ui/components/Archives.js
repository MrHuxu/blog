import $ from 'jquery';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAllArticles } from '../actions/ArchiveActions';
import { Link } from 'react-router';

class Archives extends Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    if (!this.props.archives.length) {
      if ($('.home-item').hasClass('animated')) {
        this.props.dispatch(fetchAllArticles());
      } else {
        $('.home-item').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
          this.props.dispatch(fetchAllArticles());
        })
      }
    }
  }

  render () {
    const { archives } = this.props;

    const records = archives.map(archive => {
      return (
        <div key={archive.sequence} className='small card'>
          <div className='content'>
            <Link to={`/archives/${archive.name}`} className='header'
               style={{
                 font: '15px "Josefin Sans"',
                 fontWeight: '500'
               }}
            >
              {archive.title}
            </Link>
            <div className='meta'>
            <span className='date'>@{`${archive.time.month}/${archive.time.day}/${archive.time.year}`}</span>
            </div>
          </div>
          <div className='extra content'>
            <i className='tag icon'></i>
            {archive.tags.map(tag => <a key={tag}>{tag}&nbsp;</a>)}
          </div>
        </div>
      );
    });

    return this.props.children || (
      <div className='ui cards'>
        {records}
      </div>
    );
  }
}

var mapStateToProps = function (state) {
  return {
    archives: state.archive.entities
  };
}

export default connect(mapStateToProps)(Archives);