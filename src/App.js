import React, { Component } from 'react';
import banner from './res/coffee.jpg';
import google from './res/google.png';
import {TextField, FlatButton} from 'material-ui';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <div className="left">
          <h2>COCOAGRINDER FRANCHISE</h2>
          <div className="title-underline"></div>
          <h1>FRANCHISEE LOGIN</h1>
          <h5>MANAGE YOUR COCOAGRINDER FRANCHISEE ACCOUNT</h5>
          <div className="form">
            <TextField
              fullWidth={true}
              className="email"
              hintText="E-mail" />
              <br />
            <TextField
              fullWidth={true}
              type="password"
              className="password"
              hintText="Password" />
            <br />
            <FlatButton fullWidth={true} className="login" label="Login" />
            <FlatButton fullWidth={true} className="logingoogle" icon={<img src={google} alt="" />} label="Login with Google" />
          </div>
        </div>
        <div className="right">
        </div>
      </div>
    );
  }
}

export default App;
