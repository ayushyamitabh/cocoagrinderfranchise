import React, {Component} from 'react';
import * as firebase from 'firebase';
import {FlatButton} from 'material-ui';

class Shop extends Component {
  constructor(props) {
    super(props);
    this.state= {
      a : false
    }
    this.logout = this.logout.bind(this);
  }
  componentDidMount(){
  }
  logout(){
    firebase.auth().signOut();
    this.props.toLogin();
  }
  render() {
    return(
      <div>
        <FlatButton label="Logout" onClick={this.logout} />
        <br />

      </div>
    );
  }
}

export default Shop;
