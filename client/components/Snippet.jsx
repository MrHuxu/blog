import $ from 'jquery';
import React, { Component } from 'react';
import Radium from 'radium';
import { Link } from 'react-router';

const style = {
  snippet : {
    margin       : '0 0 0 0',
    padding      : '20px 0 33px 0',
    borderBottom : '1.2px solid #ddd'
  },

  snippetTitle : {
    margin     : '0 0 5px 0',
    minHeight  : '1rem',
    lineHeight : '4rem'
  },

  titleText : {
    color: '#666',
    fontFamily : "Lato,'Helvetica Neue',Arial,Helvetica,sans-serif",

    ':hover': {
      color: '#444'
    }
  },

  snippetTime : {
    fontSize      : '1rem',
    letterSpacing : '1px',
    margin        : '20px 0 0 0',
    color         : '#aaa'
  }
};

@Radium
class Snippet extends Component {
  static propTypes = {
    archive : React.PropTypes.shape({
      name      : React.PropTypes.string.isRequired,
      sequence  : React.PropTypes.number.isRequired,
      shortName : React.PropTypes.string.isRequired,
      title     : React.PropTypes.string.isRequired,
      snippet   : React.PropTypes.string.isRequired,
      time      : React.PropTypes.shape({
        year  : React.PropTypes.string.isRequired,
        month : React.PropTypes.string.isRequired,
        day   : React.PropTypes.string.isRequired
      }).isRequired,
      tags : React.PropTypes.arrayOf(React.PropTypes.string).isRequired
    }).isRequired
  };

  componentDidMount () {
    const refs = this.refs
    $(refs.content.children[0]).hide();
    var re = /[a-zA-Z0-9_\.\-\_]+/g;
  }

  render () {
    const { archive } = this.props;

    return (
      <div key = {archive.sequence} style = {style.snippet}>
        <div>
          <div className = 'ui text loader'></div>
        </div>

        <div
          ref = 'title'
          style = {style.snippetTitle}
        >
          <Link
            to = {`/post/${archive.name}`}
          >
            <h1 style = {style.titleText}>{archive.title}</h1>
          </Link>
        </div>
        <div
          ref = 'content'
          dangerouslySetInnerHTML = {{__html: archive.snippet}}
        />

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
