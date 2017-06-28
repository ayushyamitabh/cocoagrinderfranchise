import React, { Component } from 'react';
import Login from './Login.js';
import Signup from './Signup.js';
import $ from 'jquery';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      page: 'login'
    };
    this.pageChanger = this.pageChanger.bind(this);
    this.toLogin = this.toLogin.bind(this);
  }
  pageChanger(newState) {
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
  render() {
    return (
      <div>
        <div className="left">
          <h2>COCOAGRINDER FRANCHISE</h2>
          <div className="title-underline"></div>
        {
          this.state.page === 'login' ? <Login changePage={this.pageChanger} /> :
          <Signup toLogin={this.toLogin} />
        }
      </div>
      <div className="right">
      </div>
      </div>
    );
  }
}

export default App;
