import React, {Component} from 'react';
import $ from 'jquery';
import {FlatButton} from 'material-ui';

class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      a: ''
    }

  }
  componentDidMount(){
    $('.left').addClass('full-screen');
  }
  render () {
    return (
      <div>
        <h1>CHECKOUT</h1>
        <br />
        <FlatButton onClick={this.props.backToShop} label="Nevermind, I'm Not Done Shopping"/>
      </div>
    );
  }
}
export default Checkout;
