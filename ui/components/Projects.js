import $ from 'jquery';
import React, { Component } from 'react';

class Projects extends Component {
  render () {
    return (
      <div className='ui segment'>
        <h3 className='widget-title'>Projects</h3>
        <div className='item'>
          <a href="https://github.com/MrHuxu/blog_sinatra">blog_sinatra</a>
          <p>最开始版本的博客，使用了PostgreSQL作为数据库，前端使用Bootstrap，但是效果并不尽如人意，因为前端知识的匮乏，所以文章排版很难看，这才有了现在的这个博客</p>
        </div>
        <div className='item'>
          <a href="https://github.com/MrHuxu/slimdown">slimdown</a>
          <p>使用Semantic-ui作为前端框架，顾名思义，用Slim+Markdown来显示文章，简单了很多，网页上的文章排版也更容易。</p>
        </div>
        <div className='item'>
          <a href="https://github.com/MrHuxu/lifetools">lifetools</a>
          <a href="http://lifetools.herokuapp.com">Sample</a>
          <p>一个使用PhantomJs+Nokogiri写的可以用来查询天气和快递的小应用，已经部署到了Heroku上。</p>
        </div>
        <div className='item'>
          <a href="https://github.com/MrHuxu/ModeSetting">ModeSetting</a>
          <p>一个安卓上的小应用，可以用来对通话记录，短信，应用程序进行自定义的隐藏。</p>
        </div>
        <div className='item'>
          <a href="https://github.com/MrHuxu/ci_wiki">ci_wiki</a>
          <p>使用ci框架编写的一个小型协同写作wiki系统。</p>
        </div>
        <div className='item'>
          <a href="https://github.com/MrHuxu/JavaMinesweeper">JavaMinesweeper</a>
          <p>使用Swing写的一个扫雷游戏。</p>
        </div>
      </div>
    );
  }
}

export default Projects;