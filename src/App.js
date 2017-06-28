import React, { Component } from 'react';
import Login from './Login.js';
import $ from 'jquery';
import {FlatButton, Divider, DatePicker, TextField} from 'material-ui';
import './App.css';

let DateTimeFormat = global.Intl.DateTimeFormat;

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      page: 'login',
      date: new Date()
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
          <div className="signup-page">
            <FlatButton onClick={this.toLogin} fullWidth={true} className="toLogin" label="Back to Login" />
            <Divider className="divider"/>
            <h6>PERSONAL INFORMATION</h6>
            <DatePicker className="date" hintText="Date" value={this.state.date} formatDate={new DateTimeFormat('en-US', {day: 'numeric', month: 'long', year: 'numeric',}).format}/>
            <TextField
              errorText="Required."
              fullWidth={true}
              id="bname"
              floatingLabelText="Legal Business Name" />
            <TextField
              errorText="Required."
              fullWidth={true}
              id="tname"
              floatingLabelText="Business Trade Name" />
            <TextField
              errorText="Required."
              fullWidth={true}
              id="address"
              floatingLabelText="Address" />
            <TextField
              errorText="Required."
              fullWidth={true}
              id="city"
              floatingLabelText="City" />
            <TextField
              errorText="Required."
              fullWidth={true}
              id="state"
              floatingLabelText="State" />
            <TextField
              errorText="Required."
              fullWidth={true}
              id="zip"
              floatingLabelText="Zip" />
            <TextField
              errorText="Required."
              fullWidth={true}
              id="lphone"
              floatingLabelText="Location Phone" />
            <TextField
              errorText="Required."
              fullWidth={true}
              id="contact"
              floatingLabelText="Primary Contact" />
            <TextField
              errorText="Required."
              fullWidth={true}
              id="phone"
              floatingLabelText="Primary Phone" />
            <TextField
              fullWidth={true}
              id="altcontact"
              floatingLabelText="Alternate Contact" />
            <TextField
              fullWidth={true}
              id="altphone"
              floatingLabelText="Alternate Phone" />
            <TextField
              errorText="Required."
              fullWidth={true}
              id="email"
              floatingLabelText="E-mail" />
            <Divider className="divider" />
            <h6>BILLING INFORMATION</h6>
            <TextField
              errorText="Required."
              fullWidth={true}
              id="billingcontact"
              floatingLabelText="Billing Contact" />
            <TextField
              errorText="Required."
              fullWidth={true}
              id="billingphone"
              floatingLabelText="Billing Phone" />
            <TextField
              errorText="Required."
              fullWidth={true}
              id="billingemail"
              floatingLabelText="Billing E-mail" />
          </div>
        }
      </div>
      <div className="right">
      </div>
      </div>
    );
  }
}

export default App;
