const apikey = process.env.SALUDR_API_KEY;
const apisecret = process.env.SALUDR_API_SECRET;
const doteenv = require ('dotenv').config();
const express = require ('express');
const app = express();
const crypto = require('crypto');
const cookie = require('cookie');
const nonce = require('nonce');
const querystring = require('querystring');
const request = ('request-promise');
const forwardingaddress = "https://boiling-inlet-58072.herokuapp.com/"

const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const scopes = "write_products"



app.set('port', (process.env.PORT || 5000))

console.log(apiKey, 'hellllllloo ====asfd')

app.get('/',(req,res) => {
    res.send ('hello world!');
});

app.listen(app.get('port'), function() {
console.log("Node app is running at localhost:" + app.get('port'))
})
