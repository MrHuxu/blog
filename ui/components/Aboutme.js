import $ from 'jquery';
import React, { Component } from 'react';

class Aboutme extends Component {
  render () {
    return (
      <div style={{
        fontFamily: '"Open Sans","Helvetica Neue",Arial,NanumBarunGothic,"Apple SD Gothic Neo",AppleGothic,"Malgun Gothic",DotumChe,sans-serif'
      }}>
        <div className='ui stackable grid'>
          <div className='eight wide column'>
            <div className='ui piled segment'>

              <div className='ui black ribbon label'>Me</div>
              <div>
                <img className='ui middle aligned small rounded image' src='https://raw.githubusercontent.com/MrHuxu/img-repo/master/blog/1.pic.jpg' />
                <span>
                  <p></p>
                </span>
              </div>

              <div className='ui orange left ribbon label'>
                <i className='write icon'></i>
              </div>
              <p>我努力不让自己静下来，我用各种方式让自己的身体器官不停地运转，有时候看过自己走过的路，我偶尔会有那次走过大桥后的困惑，那真的是我走的么，其实不知不觉，很多事就已经被我落了好远，我一个人在路上不停地前进，我不知道什么时候能停下来，或许永远都停不下来了，其实这也好，如果停下来了，我又得找一个让自己重新动起来的动力，但这往往很难，所以我很珍惜眼前的一切，我想象一切都是好的，都是我所要的，我把很多事都抛在了脑后，其实带上也无妨，但这额外的负担是无谓的，所以我不再留恋，留给过往一个背影。</p>

            </div>
          </div>
          <div className='eight wide column'>
            <div className='ui raised segment'>
              <a className='ui red ribbon label'>Name</a>
              <p>
                ( xhu || hxtheone || Xu Hu || TDFJ || 跳大飞机 ) => 胡旭
              </p>
            </div>

            <div className='ui raised segment'>
              <a className='ui blue ribbon label'>Skill Set</a>
              <ul>
                <li>Ruby</li>
                <li>Javascript</li>
                <li>C++</li>
              </ul>
            </div>

            <div className='ui raised segment'>
              <a className='ui teal ribbon label'>Career</a>
              <ul>
                <li>2010/09 ~ 2014/06: Harbin Institute of Technology</li>
                <li>2014/07 ~ Now: FreeWheel Beijing Office</li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default Aboutme;