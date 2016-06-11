import $ from 'jquery';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAllArticles, clearAllArticles } from '../actions/ArchiveActions';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import * as Colors from 'material-ui/styles/colors';

const style = {
  archives : {
    margin : '15px 0 0 0'
  },

  tagBtn : {
    margin : '5px'
  },

  linksArea : {
    margin : '15px 0 0 8px'
  },

  archiveTime : {
    fontSize : '12px',
    color    : '#888',
    display  : 'inline-block'
  },

  archiveTitle : {
    margin  : '0 0 0 10px',
    display : 'inline-block',
    font    : '15px "Lucida Grande",Helvetica,Arial,sans-serif',
    color   : '#777'
  },

  archiveTags : {
    display : 'inline-block'
  },

  tagLinks : {
    margin   : '0 0 0 6px',
    color    : '#aaa',
    fontSize : '13px',
    cursor   : 'pointer'
  }
};

class Archives extends Component {
  constructor (props) {
    super(props);
    this.state = {
      totalTags    : [],
      selectedTags : []
    };

    this.collectTags = this.collectTags.bind(this);
    this.generateAllTags = this.generateAllTags.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.filterArchive = this.filterArchive.bind(this);
    this.generateSingleItem = this.generateSingleItem.bind(this);
    this.generateSingleYear = this.generateSingleYear.bind(this);
    this.generateAllItems = this.generateAllItems.bind(this);
  }

  collectTags (archives) {
    var tags = [];
    archives.forEach((archive) => {
      archive.tags.forEach((tag) => {
        if (tags.indexOf(tag) === -1) tags.push(tag);
      });
    });
    return tags;
  }

  generateAllTags (totalTags) {
    return this.state.totalTags.map((tag) => {
      return (
        <RaisedButton
          label = {tag}
          key = {tag}
          onClick = {this.updateFilter.bind(null, tag)}
          style = {style.tagBtn}
          secondary = {this.state.selectedTags.includes(tag)}
        >
        </RaisedButton>
      );
    });
  }

  updateFilter (tag) {
    var index = this.state.totalTags.indexOf(tag);
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
      selectedTags : newTags
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


  generateSingleItem (archive) {
    return (
      <div className = 'timeline-item' key = {archive.sequence} style = {style.archiveItem}>
        <div style = {style.archiveTime}>{`${archive.time.month}/${archive.time.day}`}</div>
        <Link to = {`/post/${archive.name}`} style = {style.archiveTitle}>
          {archive.title}
        </Link>
        <div style = {style.archiveTags}>{archive.tags.map(tag => <a key = {tag} onClick = {this.updateFilter.bind(null, tag)} style = {style.tagLinks}>· {tag}&nbsp;</a>)}</div>
      </div>
    );
  }

  generateSingleYear (arr) {
    return arr.map((record, index) => {
      return (
        <div key = {index}>
          {record}
        </div>
      );
    });
  }

  generateAllItems () {
    const archives = this.filterArchive(this.props.archives);
    var years = [];
    var arrByYear = {};
    archives.forEach((archive, index) => {
      var year = archive.time.year;
      if (years.indexOf(year) === -1) years.push(year);
      if (!arrByYear[year]) arrByYear[year] = [];
      arrByYear[year].push(this.generateSingleItem(archive));
    });

    const archiveItems = years.map((year) => {
      return (
        <div key = {year}>
          <div className = 'timeline-title' style = {style.yearItem}>{year}</div>
          <div>
            {this.generateSingleYear(arrByYear[year])}
          </div>
        </div>
      );
    });

    return archiveItems;
  }

  componentDidMount () {
    $('.archives-loader').removeClass('inactive').addClass('active');
    if (!this.props.params.articleName) {
      if ($('.blog-sidebar').css('display') === 'none' || $('.home-item').hasClass('animated')) {
        this.props.dispatch(fetchAllArticles({
          page     : 0,
          fetchAll : true
        }));
      } else {
        $('.home-item').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
          this.props.dispatch(fetchAllArticles({
            page     : 0,
            fetchAll : true
          }));
        });
      }
    }
  }

  componentDidUpdate () {
    if (this.props.archives.length) {
      $('.archives-loader').removeClass('active').addClass('inactive');
    }
  }

  componentWillMount () {
    this.props.dispatch(clearAllArticles());
  }

  componentWillUnmount () {
    this.props.dispatch(clearAllArticles());
  }

  render () {
    const archives = this.filterArchive(this.props.archives);
    this.state.totalTags = this.collectTags(this.props.archives);

    document.title = 'Life of xhu - Archives';

    return (
      <div style = {style.archives}>
        {this.generateAllTags()}
        <div style = {style.linksArea} className = 'timeline-container'>
          {this.generateAllItems()}
        </div>
      </div>
    );
  }
}

var mapStateToProps = function (state) {
  return {
    archives : state.archive.entities
  };
};

export default connect(mapStateToProps)(Archives);
