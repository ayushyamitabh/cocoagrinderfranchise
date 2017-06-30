import React, {Component} from 'react';
import * as firebase from 'firebase';
import loading from './res/loading.gif';
import {Badge, IconButton, FlatButton, Card, CardTitle, CardActions, TextField} from 'material-ui';
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
      quantity : 0
    }
    this.logout = this.logout.bind(this);
    this.addItem = this.addItem.bind(this);
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
    Moltin.Cart.AddProduct(this.state.products[num].id, quant).then((item) => {
      alert(`Added ${item.data[0].name} to your cart`);
      this.setState({
        quantity: curr + quant
      })
    });
  }
  render() {
    return(
      <div className="shop">
        {
          this.state.products === 'loading' ? <img src={loading} alt="" /> :
          <div>
            <Badge className="cart-icon" badgeContent={this.state.quantity} secondary={true} badgeStyle={{top: 20, right: 15}}>
              <IconButton>
                <Person />
              </IconButton>
            </Badge>
            <br />
            <div className="user-toolbar">
              <h4>{this.state.user}</h4>
              <div className="user-logout">
                <FlatButton fullWidth={true} label="Logout" onClick={this.logout} />
              </div>
            </div>
            <br />
            {
              this.state.products.map((data, index)=>{
                return ( <Product addItem={this.addItem} key={data.sku} name={data.name} price={data.price[0].amount} id={index} /> );
              })
            }
          </div>
        }
      </div>
    );
  }
}

function Product (props) {
  return (
    <Card className="product-card" id={`product${props.id}`}>
      <CardTitle
        title={props.name}
        subtitle={`$ ${props.price}`}
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
