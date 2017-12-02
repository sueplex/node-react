import React, { Component } from 'react';
import { Header, Footer, App } from './common';
import { BrowserRouter } from 'react-router-dom';
//import Home from './home';
//import Sage from './sage';
//import { BrowserRouter as Router, Route} from 'react-router';


export default class Root extends Component {
  render() {
    const contentStyle = {
      minHeight: document.innerWidth //document.getElementsByTagName('body')[0].clientWidth
    };
    const sage = {
      name: 'sage'
    };
    return (
      <div className="content" style={contentStyle}>
        <Header isLoggedIn={true} user={sage} />
        <BrowserRouter basename="/">
          <App/>
        </BrowserRouter>
        <Footer />
      </div>
    );
  }
}
