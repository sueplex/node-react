import React, { Component } from 'react';
import axios from 'axios';
import { Header, App } from './common';
import { BrowserRouter } from 'react-router-dom';


export default class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: false
    };
  }

  componentWillMount() {
    axios.post('/me')
      .then((res) => {
        if (res.status === 200) {
          if (res.data.user) {
            this.setState({
              user: res.data.user
            });
          }
        }
      })
      .catch((err) => {
        throw err;
      });
  }


  render() {
    const contentStyle = {
      minHeight: window.innerWidth
    };
    return (
      <div className="content" style={contentStyle}>
        <BrowserRouter basename="/">
          <div>
            <Header user={this.state.user} />
            <App user={this.state.user} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}
