import React from 'react';
import PropTypes from 'prop-types';
import LoginPage from '../pages/LoginPage';
//import SettingsPage from '../pages/SettingsPage';
import { Switch, Route, Redirect } from 'react-router';

class App extends React.Component {
  render() {
    return (
      <div className="content">
        <Switch>
          <Route path="/login" render={() =>
            this.props.user ?
              <Redirect to="/" />
             :
              <LoginPage />

          }/>
        </Switch>
      </div>
    );
  }

}

App.propTypes = {
  user: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ])
};

export default App;
