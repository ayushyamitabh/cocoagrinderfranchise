import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import registerServiceWorker from './registerServiceWorker';
import * as firebase from 'firebase';
import './index.css';
var config = {
  apiKey: "AIzaSyCS6-iikOnF-t6vLskVRbLGJaowIKWSAF8",
  authDomain: "cocoagrinder-af99e.firebaseapp.com",
  databaseURL: "https://cocoagrinder-af99e.firebaseio.com",
  projectId: "cocoagrinder-af99e",
  storageBucket: "",
  messagingSenderId: "642782349955"
};
firebase.initializeApp(config);
injectTapEventPlugin();
ReactDOM.render(<MuiThemeProvider><App /></MuiThemeProvider>, document.getElementById('root'));
registerServiceWorker();
