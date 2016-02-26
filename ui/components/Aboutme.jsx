import $ from 'jquery';
import React, { Component } from 'react';

const style = {
  aboutmeLeft: {
    width: '50%',
    display: 'inline-block'
  },

  aboutmeRight: {
    width: '50%',
    display: 'inline-block',
    verticalAlign : 'top'
  }
};

class Aboutme extends Component {
  render () {
    document.title = 'Life of xhu - Aboutme';

    return (
      <div style={style.aboutme}>
        <div style={style.aboutmeLeft} className='timeline-container'>
          <div className='timeline-title'>Me</div>
          <div className='timeline-item'>
            <img className='ui small left rounded image' src='https://raw.githubusercontent.com/MrHuxu/img-repo/master/blog/1.pic.jpg'/>
          </div>
          <div className='timeline-item'>Born on 1992/05/07.</div>
          <div className='timeline-item'>Programmer, or accurately a Web Developer.</div>
          <div className='timeline-item'>Love gaming, singing, writing & coding.</div>
          <div className='timeline-item'>Not outstanding, but on the way to be outstanding.</div>
        </div>

        <div style={style.aboutmeRight} className='timeline-container'>
          <div className='timeline-title'>Name</div>
          <div className='timeline-item'>
              ( xhu || hxtheone || Xu Hu || TDFJ || 跳大飞机 ) => 胡旭
          </div>

          <div className='timeline-title'>Skill Set</div>
          <div className='timeline-item'>Ruby</div>
          <div className='timeline-item'>Javascript</div>
          <div className='timeline-item'>C++</div>

          <div className='timeline-title'>Career</div>
          <div className='timeline-item'>2010/09 ~ 2014/06: Harbin Institute of Technology</div>
          <div className='timeline-item'>2014/07 ~ Now: FreeWheel Beijing Office</div>
        </div>

      </div>
    );
  }
}

export default Aboutme;