import React from 'react';
import PropTypes from 'prop-types';

const Header = ({isLoggedIn, user}) => {
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
        { isLoggedIn && user &&
            <li className="navbar-item right">
              <a className="nav-link" href="#">{user.name}</a>
            </li>
        }
        { !isLoggedIn &&
          <li className="navbar-item right">
            <a className="nav-link" href="#">Register</a>
          </li>
        }
        { !isLoggedIn &&
          <li className="navbar-item right">
            <a className="nav-link" href="#">Login</a>
          </li>
        }
        </ul>
      </div>
    </div>
  );
}

Header.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
};

export default Header;
