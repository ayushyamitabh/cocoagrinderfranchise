import React, { Component } from 'react';
import {FlatButton, RaisedButton, Divider, DatePicker, TextField, SelectField, MenuItem} from 'material-ui';

let DateTimeFormat = global.Intl.DateTimeFormat;

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date()
    };
    this.handleOption = this.handleOption.bind(this);
  }
  handleOption(event){
    console.log(event);
  }
  render() {
    return (
      <div className="signup-page">
        <h1>FRANCHISEE SIGN-UP</h1>
        <h5>CREATE AN ACCOUNT TO GET STARTED WITH COCOAGRINDER FRANCHISE</h5>
        <FlatButton onClick={this.props.toLogin} fullWidth={true} className="toLogin" label="Back to Login" />
        <form>
          <DatePicker
            required={true}
            floatingLabelText="Date"
            className="date"
            id="date"
            name="name"
            value={this.state.date}
            formatDate={new DateTimeFormat('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',}).format}
          />
          <Divider className="divider"/>
          <h5>PERSONAL INFORMATION</h5>
          <TextField
            required={true}
            fullWidth={true}
            id="bname" name="bname"
            floatingLabelText="Legal Business Name" />
          <TextField
            required={true}
            fullWidth={true}
            id="tname" name="tname"
            floatingLabelText="Business Trade Name" />
          <TextField
            required={true}
            fullWidth={true}
            id="address" name="address"
            floatingLabelText="Address" />
          <TextField
            required={true}
            fullWidth={true}
            id="city" name="city"
            floatingLabelText="City" />
          <TextField
            required={true}
            fullWidth={true}
            id="state" name="state"
            floatingLabelText="State" />
          <TextField
            required={true}
            fullWidth={true}
            id="zip" name="zip"
            floatingLabelText="Zip" />
          <TextField
            required={true}
            fullWidth={true}
            id="lphone" name="lphone"
            floatingLabelText="Location Phone" />
          <TextField
            required={true}
            fullWidth={true}
            id="contact" name="contact"
            floatingLabelText="Primary Contact" />
          <TextField
            required={true}
            fullWidth={true}
            id="phone" name="phone"
            floatingLabelText="Primary Phone" />
          <TextField
            fullWidth={true}
            id="altcontact" name="altcontact"
            floatingLabelText="Alternate Contact" />
          <TextField
            fullWidth={true}
            id="altphone" name="altphone"
            floatingLabelText="Alternate Phone" />
          <TextField
            required={true}
            fullWidth={true}
            id="email" name="email"
            floatingLabelText="E-mail" />
          <Divider className="divider" />
          <h5>BILLING INFORMATION</h5>
          <TextField
            required={true}
            fullWidth={true}
            id="billingcontact" name="billingcontact"
            floatingLabelText="Billing Contact" />
          <TextField
            required={true}
            fullWidth={true}
            id="billingphone" name="billingphone"
            floatingLabelText="Billing Phone" />
          <TextField
            required={true}
            fullWidth={true}
            id="billingemail" name="billingemail"
            floatingLabelText="Billing E-mail" />
          <SelectField
            required={true}
            id="taxitin" name="taxitin"
            floatingLabelText="Tax Classification"
            value={this.state.value}
            fullWidth={true}
          >
            <MenuItem value={1} onClick={()=>{this.setState({value:1})}} primaryText="TAX ID Number" />
            <MenuItem value={2} onClick={()=>{this.setState({value:2})}} primaryText="ITIN Number" />
          </SelectField>
          {
            this.state.value === 1 ? <TextField  required={true} fullWidth={true} name="tax" id="tax" floatingLabelText="TAX ID" maxLength={9} /> :
            this.state.value === 2 ? <TextField required={true} fullWidth={true} name="itin" id="itin" floatingLabelText="ITIN ID" maxLength={9} /> :
            <div></div>
          }
          <SelectField
            required={true}
            id="btype" name="btype"
            floatingLabelText="Business Type"
            value={this.state.btypeval}
            fullWidth={true}
          >
            <MenuItem value={1} onClick={()=>{this.setState({btypeval:1})}} primaryText="Restaurant" />
            <MenuItem value={2} onClick={()=>{this.setState({btypeval:2})}} primaryText="Cafe" />
            <MenuItem value={3} onClick={()=>{this.setState({btypeval:3})}} primaryText="Bakery" />
            <MenuItem value={4} onClick={()=>{this.setState({btypeval:4})}} primaryText="University" />
            <MenuItem value={5} onClick={()=>{this.setState({btypeval:5})}} primaryText="School" />
            <MenuItem value={6} onClick={()=>{this.setState({btypeval:6})}} primaryText="Retail" />
            <MenuItem value={7} onClick={()=>{this.setState({btypeval:7})}} primaryText="Manufacturer" />
            <MenuItem value={8} onClick={()=>{this.setState({btypeval:8})}} primaryText="Distributor" />
            <MenuItem value={9} onClick={()=>{this.setState({btypeval:9})}} primaryText="Corporate" />
            <MenuItem value={10} onClick={()=>{this.setState({btypeval:10})}} primaryText="Caterer" />
            <MenuItem value={11} onClick={()=>{this.setState({btypeval:11})}} primaryText="Non-Profit" />
          </SelectField>
          <Divider className="divider" />
          <h5>DELIVERY INFORMATION</h5>
          <TextField
            required={true}
            fullWidth={true}
            id="delcontact" name="delcontact"
            floatingLabelText="Delivery Contact" />
          <TextField
            required={true}
            fullWidth={true}
            id="deladdress" name="deladdress"
            floatingLabelText="Delivery Address" />
          <TextField
            required={true}
            fullWidth={true}
            id="delcity" name="delcity"
            floatingLabelText="City" />
          <TextField
            required={true}
            fullWidth={true}
            id="delstate" name="delstate"
            floatingLabelText="State" />
          <TextField
            required={true}
            fullWidth={true}
            id="delzip" name="delzip"
            floatingLabelText="Zip Code" />
          <TextField
            required={true}
            fullWidth={true}
            id="delphone" name="delphone"
            floatingLabelText="Delivery Phone" />
          <TextField
            required={true}
            fullWidth={true}
            id="deltime" name="deltime"
            floatingLabelText="Receiving Hours" />
          <TextField
            multiLine={true}
            fullWidth={true}
            id="deldetails" name="deldetails"
            floatingLabelText="Details or Special Instructions" />
          <RaisedButton primary={true} fullWidth={true} label="SIGN UP" name="signup" id="signup" type="submit" />
        </form>
      </div>
    );
  }
}
export default Signup;
