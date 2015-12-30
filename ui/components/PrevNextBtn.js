import $ from 'jquery';
import React, { Component } from 'react';

class PrevNextBtn extends Component {
  constructor (props) {
    super(props);

    this.handlePrevBtn = this.handlePrevBtn.bind(this);
    this.handleNextBtn = this.handleNextBtn.bind(this);
  }

  handlePrevBtn () {
    if (this.props.page > 0) {
      document.body.scrollTop = 0;
      this.props.changePage(this.props.page - 1);
    }
  }

  handleNextBtn () {
    if (this.props.page < this.props.pageCount - 1) {
      document.body.scrollTop = 0;
      this.props.changePage(this.props.page + 1);
    }
  }

  render () {
    return (
      <div style={{textAlign: 'center'}}>
        <div className='ui buttons'>
          <button
            onClick = {this.handlePrevBtn}
            className = {`ui button circular ${this.props.page > 0 ? '' : 'disabled'}`}
          >
            <i className='caret left arrow icon'/>Prev&nbsp;
          </button>
          <div className='or'></div>
          <button
            onClick = {this.handleNextBtn}
            className = {`ui button circular ${this.props.page < this.props.pageCount - 1 ? '' : 'disabled'}`}
          >
            &nbsp;Next<i className='caret right arrow icon'/>
          </button>
        </div>
      </div>
    );
  }
}

export default PrevNextBtn;