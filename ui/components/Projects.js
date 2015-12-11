import $ from 'jquery';
import React, { Component } from 'react';

class Projects extends Component {
  render () {
    return (
      <div className='ui segment'>
        <h3 className='widget-title'>Projects</h3>
        <div className='ui relaxed divided list'>
          <div className='item'>
            <i className='large github middle aligned icon'></i>
            <div className='content'>
              <a target='_blank' href='https://github.com/MrHuxu/slimdown' className='header'>MrHuxu/slimdown</a>
              <div className='description'>Updated 10 mins ago</div>
            </div>
          </div>
          <div className='item'>
            <i className='large github middle aligned icon'></i>
            <div className='content'>
              <a target='_blank' href='https://github.com/MrHuxu/lifetools' className='header'>MrHuxu/lifetools</a>
              <div className='description'>
                Updated 22 mins ago &nbsp; 
                <a target='_blank' href="http://lifetools.herokuapp.com">Sample</a>
              </div>
            </div>
          </div>
          <div className='item'>
            <i className='large github middle aligned icon'></i>
            <div className='content'>
              <a target='_blank' href='https://github.com/MrHuxu/ModeSetting' className='header'>MrHuxu/ModeSetting</a>
              <div className='description'>Updated 34 mins ago</div>
            </div>
          </div>
          <div className='item'>
            <i className='large github middle aligned icon'></i>
            <div className='content'>
              <a target='_blank' href='https://github.com/MrHuxu/ci_wiki' className='header'>MrHuxu/ci_wiki</a>
              <div className='description'>Updated 34 mins ago</div>
            </div>
          </div>
          <div className='item'>
            <i className='large github middle aligned icon'></i>
            <div className='content'>
              <a target='_blank' href='https://github.com/MrHuxu/ModeSetting' className='header'>MrHuxu/ModeSetting</a>
              <div className='description'>Updated 34 mins ago</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Projects;