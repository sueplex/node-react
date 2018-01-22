import React, { Component } from 'react';
import { Header, App } from './common';
import { BrowserRouter } from 'react-router-dom';
//import Home from './home';
//import Sage from './sage';
//import { BrowserRouter as Router, Route} from 'react-router';


export default class Root extends Component {
  render() {
    const contentStyle = {
      minHeight: window.innerWidth //document.getElementsByTagName('body')[0].clientWidth
    };

    let user = {
      name: localStorage.getItem("user")
    }
    return (
      <div className="content" style={contentStyle}>
        <Header user={user} />
        <BrowserRouter basename="/">
          <App/>
        </BrowserRouter>
      </div>
    );
  }
}
