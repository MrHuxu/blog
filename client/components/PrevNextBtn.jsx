import React, { Component } from 'react';
import { Link } from 'react-router';
import IconButton from 'material-ui/IconButton';
import LeftArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import RightArror from 'material-ui/svg-icons/hardware/keyboard-arrow-right';

const style = {
  prevNextBtn : {
    margin : '9px 0 7px 0'
  },

  pageLabel : {
    color         : '#777',
    fontSize      : '0.9em',
    display       : 'inline-block',
    margin        : '12px 0 0 0',
    verticalAlign : 'top'
  }
};

class PrevNextBtn extends Component {
  static propTypes = {
    page      : React.PropTypes.number.isRequired,
    pageCount : React.PropTypes.number.isRequired
  };

  render () {
    const { page, pageCount } = this.props;
    const newerLink = <Link to = {page > 0 ? `/page/${page - 1}` : `/page/${page}`} />;
    const olderLink = <Link to = {page + 1 < pageCount ? `/page/${page + 1}` : `/page/${page}`} />;

    return (
      <div style = {style.prevNextBtn}>
        <div style = {{display: 'inline-block'}}>
          <IconButton
            label = 'Newer'
            disabled = {this.props.page <= 0}
            containerElement = {newerLink}
          >
            <LeftArrow />
          </IconButton>
        </div>

        <div style = {style.pageLabel}>Page {page} of {pageCount}</div>

        <div style = {{display: 'inline-block'}}>
          <IconButton
            label = 'Older'
            disabled = {this.props.page >= this.props.pageCount}
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
