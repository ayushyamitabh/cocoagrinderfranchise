import React, {Component} from 'react';
import banner from './res/coffee.jpg';
import google from './res/google.png';
import * as firebase from 'firebase';
import {TextField, FlatButton, Divider} from 'material-ui';

var provider = new firebase.auth.GoogleAuthProvider();

class Login extends Component {
  constructor(props) {
    super(props);
    this.state={
      logged: false,
      name : ''
    }
    this.login = this.login.bind(this);
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user)=>{
      if (user) {
        this.setState({
          logged: true,
          name: user.displayName
        })
      } else {
        this.setState({
          logged: false,
          name: ''
        })
      }
    })
  }
  googleSignIn() {
    firebase.auth().signInWithPopup(provider).then(function(result) {
      var token = result.credential.accessToken;
      var user = result.user;
    }).catch(function(error) {
      var errorCode = error.code;
      console.log(errorCode);
      var errorMessage = error.message;
      console.log(errorMessage);
      var email = error.email;
      console.log(email);
      var credential = error.credential;
      console.log(credential);
    });
  }
  login(){
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    firebase.auth().signInWithEmailAndPassword(email, password).catch((error)=>{
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    }).then(()=>{
      this.props.toShop();
    })
  }
  logout(){
    firebase.auth().signOut();
  }
  render() {
    return (
      <div>
          <h1>FRANCHISEE LOGIN</h1>
          <h5>MANAGE YOUR COCOAGRINDER FRANCHISEE ACCOUNT</h5>
          <div className="form">
          {
            this.state.logged ?
            <div>
              <h4>
                You're logged in as <span className="loggedin-name">{this.state.name}</span>
              </h4>
                <FlatButton onClick={this.props.toShop} fullWidth={true} className="continue" label={`Continue as ${this.state.name}?`} />
                <FlatButton onClick={this.logout} fullWidth={true} className="logout" label="Logout" />
            </div> :
            <div>
              <TextField
                fullWidth={true}
                className="email"
                id="email"
                hintText="E-mail" />
                <br />
              <TextField
                fullWidth={true}
                type="password"
                id="password"
                className="password"
                hintText="Password" />
              <br />
              <FlatButton fullWidth={true} onClick={this.login} className="login" label="Login" />
              <FlatButton fullWidth={true} onClick={this.googleSignIn} className="logingoogle" icon={<img src={google} alt="" />} label="Login with Google" />
              <Divider className="divider"/>
              <FlatButton onClick={this.props.toSignup} fullWidth={true} className="signup" label="Sign Up" />
            </div>
          }
          </div>
        </div>
    );
  }
}

export default Login;
