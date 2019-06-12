const express = require ('express');
const app = express();
const crypto = require('crypto');
const cookie = require('cookie');
const nonce = require('nonce');
const querystring = require('querystring');
const request = ('request-promise');

const apiKey = "f0c01221a35fc4164bdb0015ae7f8b41";
const apiSecret = "d033f7ce079d7b048525d8af3cc7e9db";
const scopes = "write_products"
const forwardingAddress = 'https://saludr-2.herokuapp.com'

app.set('port', (process.env.PORT || 5000))

// Install app
app.get('/shopify',(req,res) => {
    const shop = req.query.shop;
    if (shop) {
        const state = nonce();
        const redirectUri = forwardingAddress + '/shopify/callback'
        const installUrl = 'https://' + shop + '/admin/oauth/authorize?client_id=' + apiKey +
        '&scope=' + scopes +
        '&state=' + state +
        '&redirect_uri=' + redirectUri;

        res.cookie('state', state)
        res.redirect(installUrl)
    } else {
        return res.status(400).send('Missing shop parameter. Please add ?shop=your-dev-shop.myshopify.com')
    }
});

// API Url
app.get('/shopify/callback', (req, res) => {
    const { shop, hmac, code, state } = req.query;
    const stateCookie = cookie.parse(req.headers.cookie).state;
    if (state != stateCookie) {
        return res.status(403).send('Request origin could not be verified')
    }

    if (shop && hmac && code) {
        const map = Object.assign({}, req.query);
        delete map['hmac'];
        const message = querystring.stringify(map);
        const generatedHash = crypto.createHmac('sha256', apiSecret).update(message).digest('hex')

        if (generatedHash != hmac) {
            return res.status(400).send('HMAC validation failed')
        }

        const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
        const accessTokenPayload = {
            client_id: apiKey,
            client_secret: apiSecret,
            code
        }

        request.post(accessTokenRequestUrl, {json: accessTokenPayload})
            .then(accessTokenResponse => {
                const accessToken = accessTokenResponse.access_token;
                const apiRequestUrl = 'https://' + shop + '/admin/products.json'; 
                const apiRequestHeader = {
                    'X-Shopify-Access-Token': accessToken
                }
                request.get(apiRequestUrl, { headers: apiRequestHeader })
                    .then(apiResponse => {
                        res.end(apiResponse)
                    }).catch(error => {
                        res.status(error.statusCode).send(error.error.error_description)
                    })
            }).catch(error => {
                res.status(error.statusCode).send(error.error.error_description)
            })


    } else {
        res.status(400).send('Required params missing')
    }
})

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
})
