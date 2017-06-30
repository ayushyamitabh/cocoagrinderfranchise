import React, {Component} from 'react';
import * as firebase from 'firebase';
import loading from './res/loading.gif';
import {Badge, IconButton, Divider, FlatButton, RaisedButton, Card, CardTitle, CardActions, TextField, Snackbar, Drawer, MenuItem} from 'material-ui';
import { MoltinClient } from 'moltin-react';
import Person from 'material-ui/svg-icons/social/person';
import $ from 'jquery';

const Moltin = MoltinClient({
  clientId: 'FiIkACdbx4UR4ueX19Vs1td84tVWBcJluUvxYA2etg'
});
Moltin.Authenticate().then((response) => {
  // console.log('authenticated', response);
});

class Shop extends Component {
  constructor(props) {
    super(props);
    this.state= {
      products : 'loading',
      quantity : 0,
      snackbaropen: false,
      draweropen: false
    }
    this.logout = this.logout.bind(this);
    this.addItem = this.addItem.bind(this);
    this.handleSnackbarRequestClose = this.handleSnackbarRequestClose.bind(this);
    this.handleDrawerRequestClose = this.handleDrawerRequestClose.bind(this);
    this.openDrawer = this.openDrawer.bind(this);
    this.prepareCheckout = this.prepareCheckout.bind(this);
    this.emptyCart = this.emptyCart.bind(this);
  }
  componentDidMount(){
    $('.left').addClass('shop');
    Moltin.Products.All().then((products) => {
      this.setState({
        products: products['data']
      })
    });
    this.setState({
      user: firebase.auth().currentUser.displayName
    })
    Moltin.Cart.Items().then((items)=>{
      if (items.meta.display_price.without_tax.formatted === 0 || items.meta.display_price.without_tax.formatted === '0') {
        this.setState({
          quantity: items.data.length,
          total: '0.00',
          subtotal: '0.00',
        })
      } else {
        this.setState({
          quantity: items.data.length,
          total: items.meta.display_price.with_tax.formatted,
          subtotal: items.meta.display_price.without_tax.formatted,
        })
      }
    })
  }
  componentWillUnmount() {
    $('.left').removeClass('shop');
  }
  logout(){
    firebase.auth().signOut();
    this.props.toLogin();
  }
  addItem(num) {
    const curr = this.state.quantity;
    var quant = document.getElementById(`quantity${num}`).value;
    Moltin.Cart.AddProduct(this.state.products[num].id, parseInt(quant)).then((item) => {
      this.setState({
        quantity: item.data.length,
        total: item.meta.display_price.with_tax.formatted,
        subtotal: item.meta.display_price.without_tax.formatted,
        snackbaropen : true,
        snackbaritem: item.data[0].name
      })
    });
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
    Moltin.Cart.Items().then((items)=>{
      console.log(items);
    })
  }
  emptyCart(){
    Moltin.Cart.Delete().then(() => {
      this.setState({
        quantity: 0,
        total: '0.00',
        subtotal: '0.00'
      })
    });
  }
  render() {
    return(
      <div className="shop">
        {
          this.state.products === 'loading' ? <img src={loading} alt="" /> :
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
            {
              this.state.products.map((data, index)=>{
                return ( <Product addItem={this.addItem} key={data.sku} name={data.name} price={data.meta.display_price.with_tax.formatted} id={index} /> );
              })
            }
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
            <MenuItem>Subtotal: {this.state.subtotal}</MenuItem>
            <MenuItem>Total: {this.state.total}</MenuItem>
          </div>
          <div className="cart-bottom">
            <RaisedButton label="Start Checkout" onClick={this.prepareCheckout} secondary={true} fullWidth={true}/>
            <RaisedButton label="Empty Cart" onClick={this.emptyCart} fullWidth={true}/>
            <RaisedButton label="Hide Cart" onClick={this.handleDrawerRequestClose} primary={true} fullWidth={true}/>
          </div>
        </Drawer>
        <Snackbar
          open={this.state.snackbaropen}
          onRequestClose={this.handleSnackbarRequestClose}
          autoHideDuration={3000}
          action="View Cart"
          onActionTouchTap={()=>{this.setState({draweropen:true})}}
          message={`Added ${this.state.snackbaritem} to your cart!`}
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
        subtitle={`${props.price}`}
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
        <FlatButton onClick={()=>{props.addItem(props.id)}} fullWidth={true} label="Add to Cart" />
      </CardActions>
    </Card>
  );
}

export default Shop;
