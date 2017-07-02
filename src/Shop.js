import React, {Component} from 'react';
import * as firebase from 'firebase';
import loading from './res/loading.gif';
import {Badge, CardText, CardHeader, IconButton, Divider, FlatButton, RaisedButton, Card, CardTitle, CardActions, TextField, Snackbar, Drawer, MenuItem} from 'material-ui';
import Person from 'material-ui/svg-icons/social/person';
import Checkout from './Checkout.js';
import $ from 'jquery';

class Shop extends Component {
  constructor(props) {
    super(props);
    this.state= {
      products : 'loading',
      quantity : 0,
      snackbaropen: false,
      cartData: [],
      cart: {},
      quantity: 0,
      draweropen: false
    }
    this.logout = this.logout.bind(this);
    this.handleSnackbarRequestClose = this.handleSnackbarRequestClose.bind(this);
    this.handleDrawerRequestClose = this.handleDrawerRequestClose.bind(this);
    this.openDrawer = this.openDrawer.bind(this);
    this.addCase = this.addCase.bind(this);
    this.addSingle = this.addSingle.bind(this);
    this.prepareCheckout = this.prepareCheckout.bind(this);
    this.emptyCart = this.emptyCart.bind(this);
    this.backToShop = this.backToShop.bind(this);
  }
  componentDidMount(){
    $('.left').addClass('shop');
    firebase.database().ref('Inventory').once('value',(inventory)=>{
      this.setState({
        products: inventory.val(),
        user: firebase.auth().currentUser.displayName
      })
    })
  }
  componentWillUnmount() {
    $('.left').removeClass('shop');
  }
  logout(){
    firebase.auth().signOut();
    this.props.toLogin();
  }
  handleSnackbarRequestClose(){
    this.setState({
      snackbaropen: false
    })
  }
  handleDrawerRequestClose(){
    this.setState({
      draweropen: false
    })
  }
  openDrawer(){
    const curr = this.state.draweropen;
    this.setState({
      draweropen: !curr
    })
  }
  prepareCheckout() {
    this.setState({
      draweropen: false,
      products: 'checkout'
    })
  }
  addSingle(num, name) {
    var quantity = document.getElementById(`quantity${num}`).value;
    quantity = parseInt(quantity);
    var cartcurr = this.state.cart;
    if (cartcurr[name] !== undefined) {
      var curr = parseInt(cartcurr[name].singles);
      var caseCurr = parseInt(cartcurr[name].case);
      curr = curr + quantity;
      var currQ = parseInt(this.state.quantity);
      currQ = currQ + quantity;
      cartcurr[name] = {case:caseCurr,singles:curr};
      this.setState({
        cart: cartcurr,
        quantity: currQ,
        snackbaropen: true,
        snackbaritem: name,
        productQuantity: `${quantity} x`
      })
    } else {
      cartcurr[name] = {singles:quantity,case:0};
      var currQ = parseInt(this.state.quantity);
      currQ = currQ + quantity;
      this.setState({
        cart: cartcurr,
        quantity: currQ,
        snackbaropen: true,
        snackbaritem: name,
        productQuantity: `${quantity} x`
      })
    }
  }
  addCase(num, name){
    var cartcurr = this.state.cart;
    var quantity = document.getElementById(`quantity${num}`).value;
    quantity = parseInt(quantity);
    if (cartcurr[name] !== undefined) {
      var curr = parseInt(cartcurr[name].case);
      var singlesCurr = parseInt(cartcurr[name].singles);
      curr = curr + quantity;
      var currQ = parseInt(this.state.quantity);
      currQ = currQ + quantity;
      cartcurr[name] = {case:curr,singles:singlesCurr};
      this.setState({
        cart: cartcurr,
        quantity: currQ
      })
    } else {
      cartcurr[name] = {singles:0,case:quantity};
      var currQ = parseInt(this.state.quantity);
      currQ = currQ + quantity;
      this.setState({
        cart: cartcurr,
        quantity: currQ
      })
    }
    this.setState({
      snackbaropen: true,
      snackbaritem: name,
      productQuantity: ` ${quantity} case(s) of `
    })
  }
  emptyCart() {
    var cart = this.state.cart;
    cart = {};
    this.setState({
      cart: cart,
      quantity: 0
    })
  }
  removeItem(key) {
    var cart = this.state.cart;
    var qLess = parseInt(cart[key]['singles']) + parseInt(cart[key]['case']);
    var qTotal = parseInt(this.state.quantity);
    qTotal = qTotal - qLess;
    delete cart[key];
    this.setState({
      cart: cart,
      quantity: qTotal
    })
  }
  backToShop() {
    firebase.database().ref('Inventory').once('value',(inventory)=>{
      this.setState({
        products: inventory.val()
      })
    })
  }
  render() {
    return(
      <div className="shop">
        {
          this.state.products === 'loading' ? <img src={loading} alt="" /> :
          this.state.products === 'checkout' ? <Checkout backToShop={this.backToShop} /> :
          <div>
            <div className="user-toolbar">
              <div className="user-toolbar-content">
                <div className="user-toolbar-name">
                  {this.state.user}
                </div>
                <div className="user-toolbar-cart">
                  <Badge className="cart-icon" badgeContent={this.state.quantity} secondary={true} onClick={this.openDrawer}>
                    <IconButton>
                      <Person />
                    </IconButton>
                  </Badge>
                </div>
                <div className="user-toolbar-button">
                    <FlatButton fullWidth={true} label="Logout" onClick={this.logout} />
                </div>
              </div>
            </div>
            <br />

            <div className="categories">
              {
                Object.keys(this.state.products).map((data, key)=>{
                  return(
                    <Card className="single-category" key={`cat${key}`}>
                      <CardHeader
                        title={data}
                        actAsExpander={true}
                        showExpandableButton={true}
                      />
                      <CardText expandable={true}>
                        {
                          Object.keys(this.state.products[data]).map((item, index)=>{
                            return (
                              <Product addSingle={this.addSingle} addCase={this.addCase} key={index} id={index} name={this.state.products[data][item]} />
                            );
                          })
                        }
                      </CardText>
                    </Card>
                  );
                })
              }
            </div>

          </div>
        }
        <Drawer
          className="shop-drawer"
          open={this.state.draweropen}
          onRequestClose={this.handleDrawerRequestClose}
          onClick={this.handleDrawerRequestClose}
        >
          <br />
          YOUR CART
          <Divider className="divider" />
          <div className="cart-items">
            {
              Object.keys(this.state.cart).length === 0 ?
              <div className="empty-cart">
                Add items to get started
              </div> :
              <div>
                {
                  Object.keys(this.state.cart).map((key, index)=>{
                    return(
                      <div className="cart-items-single"  key={`cartitems${index}`} id={`cartitems${index}`}>
                        <h4>{key}</h4>
                        <h6><strong>Singles: </strong>{this.state.cart[key]['singles']}</h6>
                        <h6><strong>Cases: </strong>{this.state.cart[key]['case']}</h6>
                        <FlatButton fullWidth={true} label="Remove Item" onClick={()=>{this.removeItem(key)}} />
                      </div>
                    );
                  })
                }
              </div>
            }
          </div>
          <div className="cart-bottom">
            <RaisedButton label="Start Checkout" onClick={this.prepareCheckout} secondary={true} fullWidth={true} disabled={this.state.cart.length === 0}/>
            <RaisedButton label="Empty Cart" onClick={this.emptyCart} fullWidth={true}/>
            <RaisedButton label="Hide Cart" onClick={this.handleDrawerRequestClose} primary={true} fullWidth={true}/>
          </div>
        </Drawer>
        <Snackbar
          open={this.state.snackbaropen}
          onRequestClose={this.handleSnackbarRequestClose}
          autoHideDuration={4500}
          action="View Cart"
          onActionTouchTap={()=>{this.setState({draweropen:true})}}
          message={`Added ${this.state.productQuantity} ${this.state.snackbaritem} to your cart!`}
        />
      </div>
    );
  }
}

function Product (props) {
  return (
    <Card className="product-card" id={`product${props.id}`}>
      <CardTitle
        title={props.name}
      />
      <CardActions>
        <TextField
          fullWidth={true}
          type="number"
          min={0}
          max={999}
          step={1}
          hintText="Quantity"
          defaultValue={1}
          id={`quantity${props.id}`}
        />
        <FlatButton fullWidth={true} onClick={()=>{props.addSingle(props.id, props.name)}} label="Add Singles" />
        <FlatButton fullWidth={true} onClick={()=>{props.addCase(props.id, props.name)}} label="Add Case" />
      </CardActions>
    </Card>
  );
}

export default Shop;
