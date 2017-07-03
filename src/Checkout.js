import React, {Component} from 'react';
import $ from 'jquery';
import {FlatButton, Divider, TextField, RaisedButton} from 'material-ui';
import * as firebase from 'firebase';

class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: {},
      updated: false,
      orderNum: null,
      userData: {
          billingphone:'',
          billingemail:'',
          billingcontact:'',
          delcontact:'',
          delphone:'',
          deladdress:'',
          delcity:'',
          delstate:'',
          delzip:'',
          deltime:'',
          deldetails:''
      }
    }
    this.updateData = this.updateData.bind(this);
    this.completeCheckout = this.completeCheckout.bind(this);
  }
  componentDidMount(){
    $('.left').addClass('full-screen');
    var uid = firebase.auth().currentUser.uid;
    firebase.database().ref(`Users/${uid}`).once('value',(userData)=>{
      this.setState({
        cart: userData.val().cart,
        userData: userData.val()
      })
    })
    firebase.database().ref(`Orders`).once('value',(snap)=>{
      this.setState({
        orderNum: snap.val().nextNumber
      })
    })
    this.setState({
      uid: uid
    })
  }
  updateData(e) {
    if (!this.state.updated) {
      this.setState({
        updated: true
      })
    }
    var temDat = this.state.userData;
    temDat[e.target.id] = e.target.value;
    this.setState({
      userData: temDat
    })
  }
  completeCheckout() {
    // -- Setting up for new order
    // -- Orders / {orderNum}
    //                |
    //                --- cart : { }
    //                --- user : uid
    var orderData = {
      cart: this.state.cart,
      user: this.state.uid,
      confirmed: false
    }
    var nextNumber = parseInt(this.state.orderNum) + 1;
    firebase.database().ref(`Orders/${this.state.orderNum}`).set(orderData);
    firebase.database().ref(`Orders/nextNumber`).set(nextNumber);
    // -- Setting up to edit User's Data
    var oldData = this.state.userData;
    oldData['cart']  = {}; // empty cart
    if (oldData['orders']) { // if it exists
      var num = Object.keys(oldData['orders']).length + 1; // get what the number should be for this user
      oldData['orders'][num.toString()] = this.state.orderNum; // store the number of the order, can then be used to pull order
      firebase.database().ref(`Users/${this.state.uid}`).set(oldData).then(()=>{
        this.props.backToShop(true);
      });
    } else {
      oldData['orders']={};
      oldData['orders']['1'] = this.state.orderNum;
      firebase.database().ref(`Users/${this.state.uid}`).set(this.state.userData).then(()=>{
        this.props.backToShop(true);
      });
    }
  }
  render () {
    return (
      <div className="checkout">
        <h1>CHECKOUT</h1>
        <br />
        <Divider className="divider" />
        <br />
        <FlatButton className="backtoshop" onClick={()=>{this.props.backToShop(false)}} label="Nevermind, I'm Not Done Shopping"/>
        <Divider className="divider" />
        <div className="checkout-content">
          <br />
          <h4>Billing Details</h4>
          <TextField onChange={this.updateData} id="billingcontact" fullWidth={true} floatingLabelText="Contact" value={this.state.userData.billingcontact}/>
          <TextField onChange={this.updateData} id="billingcontact" fullWidth={true} floatingLabelText="Phone" value={this.state.userData.billingphone}/>
          <TextField onChange={this.updateData} id="billingemail" fullWidth={true} floatingLabelText="E-Mail" value={this.state.userData.billingemail}/>
          {
            this.state.userData.tax ?
            <TextField onChange={this.updateData} disabled={true} id="tax" fullWidth={true} floatingLabelText="Tax" value={this.state.userData.tax}/> :
            <TextField onChange={this.updateData} disabled={true} id="itin" fullWidth={true} floatingLabelText="ITIN" value={this.state.userData.itin}/>
          }
          <Divider className="divider" />
          <br />
          <h4>Delivery Details</h4>
          <TextField onChange={this.updateData} id="delcontact" fullWidth={true} floatingLabelText="Contact" value={this.state.userData.delcontact}/>
          <TextField onChange={this.updateData} id="delphone" fullWidth={true} floatingLabelText="Phone" value={this.state.userData.delphone}/>
          <TextField onChange={this.updateData} id="deladdress" fullWidth={true} floatingLabelText="Address" value={this.state.userData.deladdress}/>
          <TextField onChange={this.updateData} id="delcity" fullWidth={true} floatingLabelText="City" value={this.state.userData.delcity}/>
          <TextField onChange={this.updateData} id="delstate" fullWidth={true} floatingLabelText="State" value={this.state.userData.delstate}/>
          <TextField onChange={this.updateData} id="delzip" fullWidth={true} floatingLabelText="Zip" value={this.state.userData.delzip}/>
          <TextField onChange={this.updateData} id="deltime" fullWidth={true} floatingLabelText="Times" value={this.state.userData.deltime}/>
          <TextField onChange={this.updateData} id="deldetails" fullWidth={true} multiLine={true} value={this.state.userData.deldetails} floatingLabelText="Details or Special Instructions" />
        </div>
        <div className="checkout-cart">
          {
            Object.keys(this.state.cart).map((key, index)=>{
              return(
                <div className="cart-items-single"  key={`cartitems${index}`} id={`cartitems${index}`}>
                  <h4>{key}</h4>
                  <h6>Singles: {this.state.cart[key]['singles']}</h6>
                  <h6>Cases: {this.state.cart[key]['case']}</h6>
                </div>
              );
            })
          }
        </div>
        <RaisedButton onClick={this.completeCheckout} fullWidth={true} primary={true} label={this.state.updated ? "Save Changes & Complete Checkout" : "Complete Checkout"} />
      </div>
    );
  }
}
export default Checkout;
