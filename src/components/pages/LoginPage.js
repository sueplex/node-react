import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';


export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login_email: '',
      login_pass: '',
      reg_email: '',
      reg_pass: '',
      reg_pass_confirm: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    if(e){ e.preventDefault(); }
    const name = e.target.name;
    this.setState({[name]: e.target.value});
  }

  handleSubmit(e) {
    if(e){ e.preventDefault(); }
    let options = {};

    switch (e.target.name) {
      case 'login_submit':
        options = {
          email: this.state.login_email,
          password: this.state.login_pass,
        };
        axios.post('/login', options)
          .then((response) => {
            if (response.status === 200) {

            }
          })
        break;

      case 'reg_submit':
        options = {
          email: this.state.reg_email,
          password: this.state.reg_pass,
          confirm_password: this.state.reg_pass_confirm
        };
        axios.post('/register', options)
          .then((response) => {
            if (response.status === 200) {

            }
          })
        break;

      default:
        return;
    }
  }

  render() {
    const tfa = this.state.tfa_mode;
    const loggedIn = this.state.loggedIn;
    return (
      <div className="login-container">
      { loggedIn &&
        <Redirect to="/"/>
      }
      { !tfa &&
        <div className="login">
          <div className="login-title">Login or Register</div>

          <form className="login-form" id="login" action="">
            <p className="form-title"> Login </p>
            <label className="form-label" htmlFor="login_email">Email</label>
            <input className="form-field" type="text" name="login_email" onChange={ this.handleChange }/>
            <label className="form-label" htmlFor="login_pass">Password</label>
            <input className="form-field" type="password" name="login_pass" onChange={ this.handleChange }/>

            <input className="form-button" name="login_submit" type="submit" onClick={ this.handleSubmit }/>
          </form>

          <form className="login-form" id="registration" action="">
            <p className="form-title"> Register </p>
            <label className="form-label" htmlFor="reg_email">Email</label>
            <input className="form-field" type="text" name="reg_email" onChange={ this.handleChange }/>
            <label className="form-label" htmlFor="reg_pass">Password</label>
            <input className="form-field" type="password" name="reg_pass" onChange={ this.handleChange }/>
            <label className="form-label" htmlFor="reg_pass_confirm">Confirm Password</label>
            <input className="form-field" type="password" name="reg_pass_confirm" onChange={ this.handleChange }/>

            <input className="form-button" name="reg_submit" type="submit" onClick={ this.handleSubmit }/>
          </form>
        </div>
      }

      { tfa &&
        <div className="tfa">
          <div className="login-title login-tfa">Login with Authentication Code</div>
          <form className="login-form" id="tfa" action="">
            <p className="form-title"> Enter your Two Factor Authentication code </p>
            <input className="form-input" type="text" name="login_tfa" onChange={ this.handleChange }/>
            <input className="form-button" name="tfa_submit" type="submit" onClick={ this.handleSubmit }/>
          </form>
        </div>


      }

      </div>
    );
  }
}
