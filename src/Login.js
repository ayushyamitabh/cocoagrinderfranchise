import React, {Component} from 'react';
import banner from './res/coffee.jpg';
import google from './res/google.png';
import * as firebase from 'firebase';
import GetInfo from './GetInfo.js';
import $ from 'jquery';
import loading from './res/loading.gif';
import {TextField, FlatButton, Divider, Dialog} from 'material-ui';

var provider = new firebase.auth.GoogleAuthProvider();

class Login extends Component {
  constructor(props) {
    super(props);
    this.state={
      logged: 'loading',
      name : '',
      dialogopen: false
    }
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.googleSignIn = this.googleSignIn.bind(this);
  }
  componentDidMount() {
    firebase.auth().getRedirectResult().then(function(result) {
      if (result.credential) {
        var token = result.credential.accessToken;
      }
      var user = result.user;
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
    }).then(()=>{
      var firebaseUser = firebase.auth().currentUser;
      if (firebaseUser){
        this.props.toShop();
      }
    })
    firebase.auth().onAuthStateChanged((user)=>{
      if (user) {
        this.setState({
          logged: 'loading'
        })
        const uid = user.uid;
        firebase.database().ref(`Users/${uid}`).once('value', (snap)=>{
          if (!snap.val()) {
            $('.left').addClass('left-signup');
            $('.right').addClass('right-signup');
            setTimeout(()=>{this.setState({page:'signup'})},400);
            this.setState({
              logged: 'getinfo',
              name: user.displayName
            })
          } else {
            this.setState({
              logged: true,
              name: user.displayName
            })
          }
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
    firebase.auth().signInWithRedirect(provider);
  }
  login(e){
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    firebase.auth().signInWithEmailAndPassword(email, password).catch((error)=>{
      var errorCode = error.code;
      var errorMessage = error.message;
      if (error) {
        this.setState({
          dialogopen: true,
          errorCode: errorCode,
          errorMessage: `${errorMessage}\nIf you logged in with Google last time, make sure to login in with Google.`
        })
      }
    }).then(()=>{
      var user = firebase.auth().currentUser;
      if (user) {
        this.props.toShop();
      }
    })
  }
  logout(){
    firebase.auth().signOut();
    this.setState({page:'login'})
    setTimeout(()=>{
      $('.left').removeClass('left-signup');
      $('.right').removeClass('right-signup');
    },1000);
  }
  handleDialogClose() {
    this.setState({
      dialogopen: false
    })
  }
  render() {
    return (
      <div>
          <Dialog
            open={this.state.dialogopen}
            title="Login Error"
            actions={<FlatButton label="OK" primary={true} keyboardFocused={true} onTouchTap={this.handleDialogClose}/>}
            modal={false}
            onRequestClose={this.handleDialogClose} >
            <h6>{this.state.errorCode}</h6>
            <br />
            <h3>{this.state.errorMessage}</h3>
          </Dialog>
          { this.state.logged === 'getinfo' ?
            <div>
              <GetInfo logout={this.logout} toShop={this.props.toShop}/>
            </div> :
            <div>
              <h1>FRANCHISEE LOGIN</h1>
              <h5>MANAGE YOUR COCOAGRINDER FRANCHISEE ACCOUNT</h5>
              <div className="form">
              {
                this.state.logged === true ?
                <div>
                  <h4>
                    You're logged in as <span className="loggedin-name">{this.state.name}</span>
                  </h4>
                    <FlatButton onClick={this.props.toShop} fullWidth={true} className="continue" label={`Continue as ${this.state.name}?`} />
                    <FlatButton onClick={this.logout} fullWidth={true} className="logout" label="Logout" />
                </div> :
                this.state.logged === false ?
                <div>
                  <form onSubmit={this.login}>
                    <TextField
                      type="email"
                      autocomplete="off"
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
                    <FlatButton fullWidth={true} type="submit" className="login" label="Login" />
                  </form>
                  <FlatButton fullWidth={true} onClick={this.googleSignIn} className="logingoogle" icon={<img src={google} alt="" />} label="Login with Google" />
                  <Divider className="divider"/>
                  <FlatButton onClick={this.props.toSignup} fullWidth={true} className="signup" label="Sign Up" />
                </div> :
                <div>
                  <img className="loading" src={loading} alt=""/>
                </div>
              }
              </div>
            </div>
          }
        </div>
    );
  }
}

export default Login;
