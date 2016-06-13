import $ from 'jquery';
import React, { Component } from 'react';
import { connect } from 'react-redux';

class Search extends Component {
  static propTypes = {
    dispatch : React.PropTypes.func.isRequired,
    archives : React.PropTypes.arrayOf(React.PropTypes.shape(
      React.PropTypes.shape({
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
      })
    )).isRequired
  };

  constructor (props) {
    super(props);
    this.state = {
      records : []
    };
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch (name) {
    $('.ui.dropdown').dropdown('set text', 'Search');
    $('.ui.dropdown > .text').addClass('default');
  }

  componentsWillUpdate (nextProps, nextState) {
    if (nextProps.archives.length !== nextState.records.length) {
      return true;
    } else {
      return false;
    }
  }

  render () {
    const { archives } = this.props;

    var searchItems = archives.map(archive => <option value = {archive.name}>{archive.title}</option>);
    var search = (
      <div className = 'four wide column' style = {{
        paddingTop : '8'
      }}>
        <div className = 'ui right aligned segment' style = {{
          padding    : '0',
          border     : '0',
          boxShadow  : '0 0 0 0',
          background : 'transparent'
        }}>
          <select className = 'ui search dropdown'>
            <option value = ''>Search</option>
            {searchItems}
          </select>
        </div>
      </div>
    );

    return search;
  }
}

var mapStateToProps = function (state) {
  return {
    archives : state.archive.entities
  };
};

export default connect(mapStateToProps)(Search);
