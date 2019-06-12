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

const apiKey = "f0c01221a35fc4164bdb0015ae7f8b41";
const apiSecret = "d033f7ce079d7b048525d8af3cc7e9db";
const scopes = "write_products"

app.set('port', (process.env.PORT || 5000))

app.get('/shopify',(req,res) => {
    const shop = req.query.shop;
    if (shop) {

    } else {
        return res.status(400).send('Missing shop parameter. Please add ?shop=your-dev-shop.')
    }
});

app.listen(app.get('port'), function() {
console.log("Node app is running at localhost:" + app.get('port'))
})
