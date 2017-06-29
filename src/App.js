import React, { Component } from 'react';
import Login from './Login.js';
import Signup from './Signup.js';
import Shop from './Shop.js';
import $ from 'jquery';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      page: 'login'
    };
    this.toSignup = this.toSignup.bind(this);
    this.toLogin = this.toLogin.bind(this);
    this.toShop = this.toShop.bind(this);
  }
  toSignup() {
    $('.left').addClass('left-signup');
    $('.right').addClass('right-signup');
    setTimeout(()=>{this.setState({page:'signup'})},400);
  }
  toLogin(){
    this.setState({page:'login'})
    setTimeout(()=>{
      $('.left').removeClass('left-signup');
      $('.right').removeClass('right-signup');
    },1000);
  }
  toShop(){
    $('.left').addClass('left-signup');
    $('.right').addClass('right-signup');
    this.setState({page:'logged'})
  }
  render() {
    return (
      <div>
        <div className="left">
          <h2>COCOAGRINDER FRANCHISE</h2>
          <div className="title-underline"></div>
        {
          this.state.page === 'login' ? <Login toSignup={this.toSignup} toShop={this.toShop}/> :
          this.state.page === 'signup' ? <Signup toLogin={this.toLogin} toShop={this.toShop}/> :
          this.state.page === 'logged' ? <Shop toLogin={this.toLogin} /> :
          <div> Something went wrong </div>
        }
      </div>
      <div className="right">
      </div>
      </div>
    );
  }
}

export default App;
