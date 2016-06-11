import $ from 'jquery';
import React, { Component } from 'react';
import { Link } from 'react-router';

const style = {
  snippet : {
    margin       : '0 0 0 0',
    padding      : '20px 0 33px 0',
    borderBottom : '1.2px solid #ddd'
  },

  snippetTitle : {
    color      : '#666',
    margin     : '0 0 5px 0',
    minHeight  : '1rem',
    fontSize   : '1.8rem',
    lineHeight : '4rem',
    fontFamily : "Lato,'Helvetica Neue',Arial,Helvetica,sans-serif"
  },

  snippetTime : {
    fontSize      : '1rem',
    letterSpacing : '1px',
    margin        : '20px 0 0 0',
    color         : '#aaa'
  }
};

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
      <div key = {archive.sequence} style = {style.snippet}>
        <div>
          <div className = 'ui text loader'></div>
        </div>

        <Link className = 'snippet-title' to = {`/post/${archive.name}`} style = {style.snippetTitle}>
          {archive.title}
        </Link>
        <div className = 'snippet-content' dangerouslySetInnerHTML = {{__html: archive.snippet}} />

        <div style = {style.snippetTime}>
          <p>
            {archive.time.month} /&nbsp;
            {archive.time.day} /&nbsp;
            {archive.time.year}
            {archive.tags.map(tag => ' · ' + tag).join('')}
          </p>
        </div>
      </div>
    );
  }
}

export default Snippet;
