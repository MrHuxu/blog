import '../../public/css/article.css';

import React, { Component } from 'react';
import { Link } from 'react-router';

class Snippet extends Component {
  render () {
    const { archive } = this.props;

    return (
      <div className='ui tall stacked segments' key={archive.sequence}>
        <div className='ui top attached segment'>
          <p style={{
            color: '#777',
            fontWeight: '700',
            padding: '0 0 0 5px'
          }}>
            {archive.time.month} 月&nbsp;
            {archive.time.day} 日&nbsp;
            {archive.time.year}
            {archive.tags.map(tag => ' · ' + tag).join('')}
          </p>
        </div>

        <div className='ui attached segment' dangerouslySetInnerHTML={{__html: archive.snippet}} style={{
          padding: '15px 15px 10px 15px'
        }}/>

        <div className='ui bottom attached clearing segment'>
          <Link to={`/archives/${archive.name}`} className="ui right floated button" style={{
            backgroundColor: '#ffffff'
          }}>
            Continue Reading
          </Link>
        </div>
      </div>
    );
  }
}

export default Snippet;