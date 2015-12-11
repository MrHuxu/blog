import $ from 'jquery';
import React, { Component } from 'react';

class Aboutme extends Component {
  render () {
    return (
      <div className='ui center aligned segment'>
        <div id='aboutme_label'>
          <img id='aboutme_img' width='100' height='100' src="https://raw.githubusercontent.com/MrHuxu/img-repo/master/ng-blog/MyLogoT.PNG" />
          <p>跳大飞机</p>
          <p>金牛座</p>
          <p>喜欢代码，热爱编程</p>
          <p>现在还不是高手，但是在成为高手的路上</p>
          <a className='mail' href="mailto:hxtheone@gmail.com">hxtheone@gmail.com</a>
          <p>希望与大家一起进步!!</p>
        </div>
      </div>
    );
  }
}

export default Aboutme;