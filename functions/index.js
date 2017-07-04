'use strict';

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
var admin = require("firebase-admin");

var serviceAccount = require("./adminServiceAccount.json");

admin.initializeApp(functions.config().firebase);

const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const mailTransport = nodemailer.createTransport(`smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);

exports.sendEmailConfirmation = functions.database.ref('/Users/{uid}/welcomed').onWrite(event => {
  const snapshot = event.data;
  const val = snapshot.val();
  admin.database().ref(`Users/${event.params.uid}`).once('value',(snapData)=>{
    var userData = snapData.val();
    const mailOptions = {
      from: '"CocoaGrinder Franchise" <cocoagrinderwholesale@gmail.com>',
      to: userData.loginemail
    };
    mailOptions.subject = "Welcome to the CocoaGrinder Franchise";
    if (val === false || val === 'false' || !val){
      mailOptions.text = `Dear ${userData.username}, \n Welcome to the CocoaGrinder Franchise team! \n You can visit https://order.cocoagrinderfranchise.com to order items from our inventory. \n Your email is ${userData.loginemail}, and your password is ${userData.loginpassword}.\n You will have a chance to change your billing and delivery details before every checkout. Stay on the look out for new features we're working on. \n Thank you,\n CocoaGrinder Franchise Team\nhttps://cocoagrinder.com \nhttps://cocoagrinderfranchise.com`;
      mailOptions.html = `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to CocoaGrinder Franchise</title>
          <style>
            @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500');
            img {
              width: 30%;
              margin-left: 35%;
            }
            a{
              font-style: normal;
              text-decoration: underline;
              color: rgba(100,100,255,0.6);
            }
            h1 {
              font-family: 'Roboto', sans-serif;
              font-weight: 400;
              text-align: center;
              text-transform: uppercase;
            }
            h3{
              font-family: 'Roboto', sans-serif;
              font-weight: 400;
              margin-top: 2%;
            }
            h4{
              margin-top: 0.5%;
              margin-bottom: 0.5%;
              font-family: 'Roboto', sans-serif;
              font-weight: 400;
            }
            .divider {
              position: relative;
              width: 100%;
              height: 1px;
              background: black;
              margin-bottom: 1%;
            }
            .content {
              width: 70%;
              margin-left: 15%;
            }
          </style>
        </head>
        <body>
          <img src="https://static1.squarespace.com/static/59055811ff7c50866d9378c4/t/59055cc4f7e0ab75890c841f/1493523654409/cropped-CG-LOGO-WHITE.png?format=500w" />
          <h1>CocoaGrinder Franchise</h1>
          <div class="content">
            <div class="divider"></div>
            <h3>Dear ${userData.username},</h3>
            <h4>We are pleased to welcome you to the CocoaGrinder Franchise team! It's great to have you with us!</h4>
            <h4>You can visit the <a href="https://order.cocoagrinderfranchise.com">CocoaGrinder Franchisee Portal</a> to order items.</h4>
            <h4>You will have a chance to change your billing and delivery details before every checkout. Stay on the look out for new features we're working on.</h4>
            <div class="divider"></div>
            <h4>Your login details are: </h4>
            <h4><strong>Login E-mail: </strong>${userData.loginemail}</h4>
            <h4><strong>Password: </strong>${userData.loginpassword}</h4>
            <div class="divider"></div>
            <h4>Thank you,</h4>
            <h4>CocoaGrinder Franchise Team</h4>
            <h4><a href="https://www.cocoagrindernyc.com">CocoaGrinder NYC</a></h4>
            <h4><a href="https://www.cocoagrinderfranchise.com">CocoaGrinder Franchise</a></h4>
          </div>
        </body>
      </html>
      `;
      admin.database().ref(`Users/${event.params.uid}/welcomed`).set(true);
      return mailTransport.sendMail(mailOptions).then(() => {
        console.log('New confirmation email sent to:', val.loginemail);
      }).catch(error => {
        console.error('There was an error while sending the email:', error);
      });
    }
  });
});

exports.sendOrderConfirmation = functions.database.ref('/Orders/{id}').onWrite(event => {
  const snapshot = event.data;
  const id = event.params.id;
  const val = snapshot.val();
  if (id === 'nextNumber') {
    console.log("Skipping nextNumber");
  } else {
    if (!val.confirmed) {
      var userEmail = '';
      admin.database().ref(`Users/${val.user}`).once('value',(dataSnap)=>{
        const userData = dataSnap.val();
        userEmail = userData.loginemail;
        const mailOptions = {
          from: '"CocoaGrinder Franchise" <cocoagrinderwholesale@gmail.com>',
          to: userEmail
        };
        mailOptions.subject = "Your CocoaGrinder Order";
        mailOptions.text = `We have received your order for: [Order # ${id}] \n`;
        Object.keys(val.cart).map((key, index)=>{
          mailOptions.text += `\t${key} : \n\t\tCase(s): ${val.cart[key].case}\n\t\tSingle(s): ${val.cart[key].singles}\n`;
        });
        mailOptions.text += `We will start processing your order soon. Thank you for ordering from the CocoaGrinder Franchise.\n Thank you,\nCocoaGrinder Franchise Team\nhttps://order.cocoagrinderfranchise.com`;
        return mailTransport.sendMail(mailOptions).then(() => {
          console.log('Order confirmation email sent to:', userEmail);
        }).catch(error => {
          console.error('There was an error while sending the order confirmation email:', error);
        });
      })
    }
  }
});

exports.sendNewOrder = functions.database.ref('/Orders/{id}').onWrite(event => {
  const snapshot = event.data;
  const val = snapshot.val();
  const id = event.params.id;
  if (id === 'nextNumber') {
    console.log("Skipping nextNumber");
  } else {
    admin.database().ref(`Users/${val.user}`).once('value',(dataSnap)=>{
      var userData = dataSnap.val();
      const mailOptions = {
        from: '"CocoaGrinder Franchise" <cocoagrinderwholesale@gmail.com>',
        to: 'cocoagrinderwholesale@gmail.com'
      };
      mailOptions.subject = `New Order Received | #${id}`;
      mailOptions.text = `New order from ${userData.username}.\n Ordered Items:\n`;
      Object.keys(val.cart).map((key, index)=>{
        mailOptions.text += `\t${key} : \n\t\tCase(s): ${val.cart[key].case}\n\t\tSingle(s): ${val.cart[key].singles}\n`;
      });
      mailOptions.text += `User's Details:\n\n`;
      mailOptions.text += `Username / Full Name : ${userData.username}\n`;
      mailOptions.text += `E-Mail : ${userData.loginemail}\n`;
      mailOptions.text += `Business Name: ${userData.bname}\n`;
      mailOptions.text += `Business Trade Name: ${userData.tname}\n`;
      mailOptions.text += `Address: ${userData.address}\n`;
      mailOptions.text += `${userData.city},`;
      mailOptions.text += `${userData.state} - `;
      mailOptions.text += `${userData.zip}\n\n`;
      mailOptions.text += `Location Phone: ${userData.lphone}\n`;
      mailOptions.text += `Primary Contact: ${userData.contact}\n`;
      mailOptions.text += `Primary Phone: ${userData.phone}\n`;
      mailOptions.text += `Alternate: ${userData.altcontact} - `;
      mailOptions.text += `${userData.altphone}\n`;
      mailOptions.text += `Business E-Mail: ${userData.email}\n\n`;
      mailOptions.text += `Billing Contact: ${userData.billingcontact}\n`;
      mailOptions.text += `Billing Phone: ${userData.billingphone}\n`;
      mailOptions.text += `Billing E-Mail: ${userData.billingemail}\n`;
      if (userData.tax) {
        mailOptions.text += `TAX ID: ${userData.tax}\n`;
      } else {
        mailOptions.text += `ITIN: ${userData.itin}\n`;
      }
      mailOptions.text += `Business Type: ${userData.btype}\n\n`;
      mailOptions.text += `Delivery Contact: ${userData.delcontact}\n`;
      mailOptions.text += `Address: ${userData.deladdress}\n`;
      mailOptions.text += `${userData.delcity},`;
      mailOptions.text += `${userData.delstate} - `;
      mailOptions.text += `: ${userData.delzip}\n`;
      mailOptions.text += `Phone: ${userData.delphone}\n`;
      mailOptions.text += `Times: ${userData.deltime}\n`;
      mailOptions.text += `Other Details: ${userData.deldetails}\n`;
      return mailTransport.sendMail(mailOptions).then(() => {
        console.log('New order email sent to:', userEmail);
      }).catch(error => {
        console.error('There was an error while sending the new order email:', error);
      });
    });
  }
});
