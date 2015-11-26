import $ from 'jquery';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAllArticles } from '../actions/ArchiveActions';

class Archives extends Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    if ($('.home-item').hasClass('animated')) {
      this.props.dispatch(fetchAllArticles());
    } else {
      $('.home-item').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
        this.props.dispatch(fetchAllArticles());
      })
    }
  }

  render () {
    const { archives } = this.props;

    const records = archives.map(archive => {
      return (
        <div className='small card'>
          <div className='content'>
            <a className='header'
               style={{
                 font: '15px "Josefin Sans"',
                 fontWeight: '500'
               }}
            >
              {archive.title}
            </a>
            <div className='meta'>
            <span className='date'>@ {`${archive.time.month}/${archive.time.day}/${archive.time.year}`}</span>
            </div>
          </div>
          <div className='extra content'>
            <i className='tag icon'></i>
            {archive.tags.map(tag => <a>{tag}&nbsp;</a>)}
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