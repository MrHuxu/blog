import '../../public/css/archives.css';

import $ from 'jquery';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAllArticles, clearAllArticles } from '../actions/ArchiveActions';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/lib/raised-button';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import CardText from 'material-ui/lib/card/card-text';

const style = {
  tagBtn: {
    margin: '5px'
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
    this.generateSingleCard = this.generateSingleCard.bind(this);
    this.generateSingleYear = this.generateSingleYear.bind(this);
    this.generateAllCards = this.generateAllCards.bind(this);
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

  generateAllTags (totalTags) {
    return this.state.totalTags.map((tag) => {
      return (
        <RaisedButton
          label     = {tag}
          key       = {tag}
          onClick   = {this.updateFilter.bind(null, tag)}
          style     = {style.tagBtn}
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


  generateSingleCard (archive) {
    return (
      <Card key={archive.sequence}>
        <CardHeader
          title    = {archive.title}
          subtitle = {`${archive.time.month}/${archive.time.day}/${archive.time.year}`}
        />
        <CardText>
          {archive.tags.map(tag => <a key={tag} style={{fontSize: '13px'}}onClick={this.updateFilter.bind(null, tag)}>{tag}&nbsp;</a>)}
        </CardText>
      </Card>
    );
  }

  generateSingleYear (arr) {
    return arr.map((record, index) => {
      return (
        <div key={index} style={{width: '25%', display: 'inline-block', verticalAlign: 'top'}}>
          {record}
        </div>
      );
    });
  }

  generateAllCards () {
    const archives = this.filterArchive(this.props.archives);

    var years = [];
    var countByYear = {};
    var arrByYear = {};

    var records = [[], [], [], []];
    archives.forEach((archive, index) => {
      var year = archive.time.year;

      if (years.indexOf(year) === -1) years.push(year);

      if (countByYear[year] === undefined)
        countByYear[year] = 0;
      else
        ++countByYear[year];

      if (!arrByYear[year])
        arrByYear[year] = [[], [], [], []];

      arrByYear[year][countByYear[year] % 4].push(this.generateSingleCard(archive));
    });

    const archiveCards = years.map((year) => {
      return (
        <div key={year}>
          <h3 className='widget-title' style={{marginTop: '15px'}}>{year}</h3>
          <div>
            {this.generateSingleYear(arrByYear[year])}
          </div>
        </div>
      );
    });

    return archiveCards;
  }

  componentDidMount () {
    $('.archives-loader').removeClass('inactive').addClass('active');
    if (!this.props.params.articleName) {
      if ($('.home-item').hasClass('animated')) {
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
      <div>
        <h3 className='widget-title'>Tags</h3>
        {this.generateAllTags()}
        {this.generateAllCards()}
      </div>
    );
  }
}

var mapStateToProps = function (state) {
  return {
    archives: state.archive.entities
  };
};

export default connect(mapStateToProps)(Archives);