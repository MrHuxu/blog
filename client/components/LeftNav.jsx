import React, { Component } from 'react';
import { Link } from 'react-router';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import ActionList from 'material-ui/svg-icons/action/list';

const style = {
  navBtn : {
    position : 'fixed',
    top      : '10px',
    right    : '10px'
  },

  navPanel : {
    padding : '20px 0 0 0'
  },

  pureText : {
    padding    : '5px 0 0 47px',
    fontSize   : '20px',
    lineHeight : '40px',
    color      : '#aaa'
  },

  linkItem : {
    padding : '0 0 0 43px',
    color   : '#666'
  },

  icons : {
    margin : '45px 0 0 10px'
  },

  iconLink : {
    width   : '25px',
    color   : '#545454',
    opacity : '0.8',
    margin  : '0 0 0 12px'
  }
};

class LeftNav extends Component {
  constructor (props) {
    super(props);
    this.state = {open: false};

    this.handleToggle = this.handleToggle.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleToggle () {
    this.setState({open: !this.state.open});
  }

  handleClose () {
    this.setState({open: false});
  }

  render () {
    return (
      <div className = 'left-nav'>
        <IconButton
          style = {style.navBtn}
          onTouchTap = {this.handleToggle}
        >
          <ActionList />
        </IconButton>

        <Drawer
          docked = {false}
          width = {200}
          open = {this.state.open}
          onRequestChange = {(open) => this.setState({open})}
        >
          <div style = {style.navPanel}>
            <div style = {style.pureText}>
              {'const {'}
            </div>

            <MenuItem
              style = {style.linkItem}
              onTouchTap = {this.handleClose}
              containerElement = {<Link to = '/' />}
            >
              Home ,
            </MenuItem>
            <MenuItem
              style = {style.linkItem}
              onTouchTap = {this.handleClose}
              containerElement = {<Link to = '/archives/' />}
            >
              Archives ,
            </MenuItem>
            <MenuItem
              style = {style.linkItem}
              onTouchTap = {this.handleClose}
              containerElement = {<Link to = '/projects/' />}
            >
              Projects ,
            </MenuItem>
            <MenuItem
              style = {style.linkItem}
              onTouchTap = {this.handleClose}
              containerElement = {<a href = 'http://xhu.me/'>Aboutme</a>}
            >
              Aboutme
            </MenuItem>

            <div style = {style.pureText}>
              {'} = xhu.life'}
            </div>

            <div style = {style.icons}>
              <a target = '_blank' href = 'http://github.com/MrHuxu' style = {style.iconLink}>
                <img style = {style.iconLink} src = '/imgs/github.svg' />
              </a>
              <a target = '_blank' href = 'http://weibo.com/2058722335' style = {style.iconLink}>
                <img style = {style.iconLink} src = '/imgs/weibo.svg' />
              </a>
              <a href = 'mailto:hxtheone@gmail.com' style = {style.iconLink}>
                <img style = {style.iconLink} src = '/imgs/email.svg' />
              </a>
            </div>
          </div>
        </Drawer>

      </div>
    );
  }
}

export default LeftNav;
