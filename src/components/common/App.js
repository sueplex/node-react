import React from 'react';
import LoginPage from '../pages/LoginPage';
import SettingsPage from '../pages/SettingsPage';
import { Switch, Route } from 'react-router';

class App extends React.Component {
  render() {
    return (
      <div className="content">
        <Switch>
          <Route path="/login" component={ LoginPage } />
          <Route path="/settings" component={ SettingsPage } />
        </Switch>
      </div>
    );
  }

}

export default App;
