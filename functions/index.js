'use strict';

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
var admin = require("firebase-admin");

var serviceAccount = require("./adminServiceAccount.json");

admin.initializeApp(functions.config().firebase);

const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const mailTransport = nodemailer.createTransport(`smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);

exports.sendEmailConfirmation = functions.database.ref('/Users/{uid}').onWrite(event => {
  const snapshot = event.data;
  const val = snapshot.val();

  const mailOptions = {
    from: '"CocoaGrinder Franchise" <cocoagrinderwholesale@gmail.com>',
    to: val.loginemail
  };

  mailOptions.subject = "Welcome to the CocoaGrinder Franchise";
  if (val.loginpassword) {
    if (!val.welcomed){
      mailOptions.text = `Dear ${val.username}, \n Welcome to the CocoaGrinder Franchise team! \n You can visit https://order.cocoagrinderfranchise.com to order items from our inventory. \n Your email is ${val.loginemail}, and your password is ${val.loginpassword}.\n You will have a chance to change your billing and delivery details before every checkout. Stay on the look out for new features we're working on. \n Thank you,\n CocoaGrinder Franchise Team\nhttps://cocoagrinder.com \nhttps://cocoagrinderfranchise.com`;
      admin.database().ref(`Users/${event.params.uid}/welcomed`).set(true);
    }
  }
  return mailTransport.sendMail(mailOptions).then(() => {
    console.log('New confirmation email sent to:', val.loginemail);
  }).catch(error => {
    console.error('There was an error while sending the email:', error);
  });
});

exports.sendOrderConfirmation = functions.database.ref('/Orders/{id}').onWrite(event => {
  if (id === 'nextNumber') {
    console.log("Skipping nextNumber");
  } else {
    const snapshot = event.data;
    const id = event.params.id;
    const val = snapshot.val();
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
  if (id === 'nextNumber') {
    console.log("Skipping nextNumber");
  } else {
    const snapshot = event.data;
    const val = snapshot.val();
    const id = event.params.id;
    var userData = '';
    admin.database().ref(`Users/${val.user}`).once('value',(dataSnap)=>{
      userData = dataSnap.val();
    });
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
  }
});
