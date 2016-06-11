import $ from 'jquery';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { clearAllArticles } from '../actions/ArchiveActions';

class Aboutme extends Component {
  componentWillMount () {
    this.props.dispatch(clearAllArticles());
  }

  render () {
    document.title = 'Life of xhu - Aboutme';

    return (
      <div>
        <div className = 'timeline-container aboutme-left'>
          <div className = 'timeline-title'>Me</div>
          <div className = 'timeline-item'>
            <img className = 'aboutme-img' src = 'https://raw.githubusercontent.com/MrHuxu/img-repo/master/blog/1.pic.jpg' />
          </div>
          <div className = 'timeline-item'>Born on 1992/05/07.</div>
          <div className = 'timeline-item'>Programmer, or accurately a Web Developer.</div>
          <div className = 'timeline-item'>Love gaming, singing, writing & coding.</div>
          <div className = 'timeline-item'>Not outstanding, but on the way to be outstanding.</div>
        </div>

        <div className = 'timeline-container aboutme-right'>
          <div className = 'timeline-title'>Name</div>
          <div className = 'timeline-item'>
              ( xhu || hxtheone || Xu Hu || TDFJ || 跳大飞机 ) => 胡旭
          </div>

          <div className = 'timeline-title'>Skill Set</div>
          <div className = 'timeline-item'>Ruby</div>
          <div className = 'timeline-item'>Javascript</div>
          <div className = 'timeline-item'>C++</div>

          <div className = 'timeline-title'>Career</div>
          <div className = 'timeline-item'>2010/09 ~ 2014/06: Harbin Institute of Technology</div>
          <div className = 'timeline-item'>2014/07 ~ Now: FreeWheel Beijing Office</div>
        </div>

      </div>
    );
  }
}

export default connect()(Aboutme);
