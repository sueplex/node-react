import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default class Header extends React.Component {

  render() {
    return (
      <div className="header">
        <a className="nav-brand" href="#">React </a>
        <div className="nav-nav">
          <ul className="navbar">
          { !this.props.user &&
            <li className="navbar-item">
              <Link className="nav-link" to="/login"> Login </Link>
            </li>
          }
          </ul>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  user: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ])
};
