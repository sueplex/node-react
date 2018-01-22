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
          </ul>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  user: PropTypes.object.isRequired,
};
