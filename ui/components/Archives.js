import $ from 'jquery';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAllArticles } from '../actions/ArchiveActions';
import { Link } from 'react-router';

class Archives extends Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedTags: []
    };

    this.collectTags = this.collectTags.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.filterArchive = this.filterArchive.bind(this);
  }

  collectTags (archives) {
    var tags = [];
    archives.forEach((archive) => {
      archive.tags.forEach((tag) => {
        if (tags.indexOf(tag) === -1) tags.push(tag);
      })
    })
    return tags;
  }

  updateFilter (totalTags, tag) {
    var index = totalTags.indexOf(tag);
    var btn = $($('.ui.button.tagBtn')[index]);
    var { selectedTags } = this.state;
    var newTags;

    if (selectedTags.indexOf(tag) === -1) {
      newTags = [...selectedTags, tag];
      btn.addClass('active');
    } else {
      selectedTags.splice(selectedTags.indexOf(tag), 1);
      newTags = selectedTags;
      btn.removeClass('active');
    }

    this.setState({
      selectedTags: newTags
    });
  }

  filterArchive () {
    const { archives } = this.props;
    const { selectedTags } = this.state;
    if (!this.state.selectedTags.length) return archives;
    var filteredArchives = archives.filter((archive) => {
      var hasTag = true;
      for (let i = 0; i < selectedTags.length; ++i) {
        if (archive.tags.indexOf(selectedTags[i]) === -1) {
          hasTag = false;
          break;
        }
      }
      return hasTag;
    });
    return filteredArchives;
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
    const archives = this.filterArchive(this.props.archives);

    var totalTags = this.collectTags(this.props.archives);
    var tagBtns = totalTags.map((tag) => {
      return (
        <button 
          key       = {tag}
          className = {`ui basic button tagBtn`}
          onClick   = {this.updateFilter.bind(null, totalTags, tag)}
          style     = {{
            margin: '3px 5px 2px 0'
          }}
        >
          {tag}
        </button>
      );
    });

    var records = [[], [], [], []];
    archives.forEach((archive, index) => {
      records[index % 4].push(
        <div key={archive.sequence} className='ui small card'>
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
            {archive.tags.map(tag => <a key={tag} onClick={this.updateFilter.bind(null, totalTags, tag)}>{tag}&nbsp;</a>)}
          </div>
        </div>
      );
    });
    const archiveCards = records.map((record, index) => {
      return (
        <div key={index} className='four wide column'>
          {record}
        </div>
      );
    });

    return this.props.children || (
      <div className='ui segment' style={{
        margin: '0 0 0 0'
      }}>
        {tagBtns}
        <div className='ui stackable grid'>
          {archiveCards}
        </div>
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