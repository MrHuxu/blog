import $ from 'jquery';
import React, { Component } from 'react';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import LeftArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import RightArror from 'material-ui/svg-icons/hardware/keyboard-arrow-right';

const style = {
  prevNextBtn: {
    margin: '9px 0 7px 0'
  },

  pageLabel: {
    color         : '#777',
    fontSize      : '0.9em',
    display       : 'inline-block',
    margin        : '12px 0 0 0',
    verticalAlign : 'top'
  }
};

class PrevNextBtn extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    const { page, pageCount } = this.props;
    const newerLink = <Link to={page > 0 ? `/page/${page - 1}` : `/page/${page}`} />;
    const olderLink = <Link to={page + 1 < pageCount ? `/page/${page + 1}` : `/page/${page}`} />;

    return (
      <div style={style.prevNextBtn}>
        <div style={{display: 'inline-block'}}>
          <IconButton
            label            = "Newer"
            disabled         = {this.props.page <= 0}
            linkButton       = {true}
            containerElement = {newerLink}
          >
            <LeftArrow />
          </IconButton>
        </div>

        <div style={style.pageLabel}>Page {page} of {pageCount}</div>

        <div style={{display: 'inline-block'}}>
          <IconButton
            label            = "Older"
            disabled         = {this.props.page >= this.props.pageCount}
            linkButton       = {true}
            containerElement = {olderLink}
          >
            <RightArror />
          </IconButton>
        </div>
      </div>
    );
  }
}

export default PrevNextBtn;