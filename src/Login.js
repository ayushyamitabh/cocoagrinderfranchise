import React, {Component} from 'react';
import banner from './res/coffee.jpg';
import google from './res/google.png';
import * as firebase from 'firebase';
import {TextField, FlatButton, Divider} from 'material-ui';

var provider = new firebase.auth.GoogleAuthProvider();

class Login extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user)=>{
      if (user) {
        console.log('Logged in!');
      } else {
        console.log('Not logged in.');
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
  logout(){
    firebase.auth().signOut();
  }
  render() {
    return (
      <div>
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
            <FlatButton fullWidth={true} onClick={this.googleSignIn} className="logingoogle" icon={<img src={google} alt="" />} label="Login with Google" />
            <Divider className="divider"/>
            <FlatButton onClick={()=>{this.props.changePage('signup')}} fullWidth={true} className="signup" label="Sign Up" />
            <FlatButton onClick={this.logout} fullWidth={true} className="logout" label="Logout" />
          </div>
        </div>
    );
  }
}

export default Login;
