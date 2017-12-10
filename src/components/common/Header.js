import React from 'react';
import PropTypes from 'prop-types';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user:this.props.user
    };
  }

  render() {
    console.log(this.props);
    const isLoggedIn = this.state.user.name ? true:false;
    return (
      <div className="header">
        <a className="nav-brand" href="#">React </a>
        <div className="nav-nav">
          <ul className="navbar">
            <li className="navbar-item">
              <a className="nav-link" href="#">Home</a>
            </li>
            <li className="navbar-item">
              <a className="nav-link" href="#">About</a>
            </li>
          { isLoggedIn && this.state.user &&
              <li className="navbar-item right">
                <a className="nav-link" href="/settings">{this.state.user.name}</a>
              </li>
          }
          { !isLoggedIn &&
            <li className="navbar-item right">
              <a className="nav-link" href="/login">Login</a>
            </li>
          }
          </ul>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  user: PropTypes.object.isRequired,
};
