import '../../public/css/article.css';

import $ from 'jquery';
import React, { Component } from 'react';
import { Link } from 'react-router';

class Snippet extends Component {
  componentDidMount () {
    $('.snippet-content h1').hide();
    $('.snippet-title').mouseenter((e) => {
      $(e.target).css({color: '#444'});
    }).mouseleave((e) => {
      $(e.target).css({color: '#666'});
    });
  }

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
            {archive.time.month} /&nbsp;
            {archive.time.day} /&nbsp;
            {archive.time.year}
            {archive.tags.map(tag => ' · ' + tag).join('')}
          </p>
        </div>

        <div className='ui attached segment snippet-content' style={{
          padding: '0 15px 10px 15px'
        }}>

          <div className='ui inactive inverted dimmer snippet-loader'>
            <div className='ui text loader'></div>
          </div>

          <Link className='snippet-title' to={`/post/${archive.name}`}style={{
            color      : '#666',
            minHeight  : '1rem',
            fontSize   : '2rem',
            lineHeight : '4rem',
            fontWeight : '700',
            fontFamily : "Lato,'Helvetica Neue',Arial,Helvetica,sans-serif"
          }}>
            {archive.title}
          </Link>
          <div dangerouslySetInnerHTML={{__html: archive.snippet}} />
        </div>

        <div className='ui bottom attached clearing segment'>
          <Link to={`/post/${archive.name}`} className="ui right floated button" style={{
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