const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const crypto = require('crypto');
const cookie = require('cookie');
const nonce = require('nonce')();
const querystring = require('querystring');
const request = require('request-promise');
const cron = require("node-cron");

/** Include required files */
const indexDetails = require('./index');


const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const port = process.env.PORT || 3000;
const scopes = 'read_products,write_products,write_inventory';
const forwardingAddress = "https://72fe01fb.ngrok.io"; // Replace this with your heroku/ngrok Forwarding address
let accessToken = '';//e8331e47bc0c9f7fc6cd15d980cba4d5 - shangri-lafashion

app.get('/', (req, res) => {
    res.send('Welcome to My ShopifyTuscanLeather Store!');
});

app.listen(port, () => {
    console.log('ShopifyTuscanLeather listening on port 3000!');
});

/** Install Route */ 
app.get('/shopify', (req, res) => {
    const shop = req.query.shop;
    if (shop) {
        const state = nonce();
        const redirectUri = forwardingAddress + '/shopify/callback';
        const installUrl = 'https://' + shop +
            '/admin/oauth/authorize?client_id=' + apiKey +
            '&scope=' + scopes +
            '&state=' + state +
            '&redirect_uri=' + redirectUri;

        res.cookie('state', state);
        res.redirect(installUrl); // remove line*****************************
    } else {
        return res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request');
    }
});


/** Callback Route */
app.get('/shopify/callback', (req, res) => {
    const { shop, hmac, code, state } = req.query;
    const stateCookie = cookie.parse(req.headers.cookie).state;
    if (state !== stateCookie) {
        return res.status(403).send('Request origin cannot be verified');
    }

    if (shop && hmac && code) {
        const map = Object.assign({}, req.query);
        delete map['signature'];
        delete map['hmac'];
        const message = querystring.stringify(map);
        const providedHmac = Buffer.from(hmac, 'utf-8');
        const generatedHash = Buffer.from(
            crypto
                .createHmac('sha256', apiSecret)
                .update(message)
                .digest('hex'),
            'utf-8'
        );
        let hashEquals = false;
        // timingSafeEqual will prevent any timing attacks. Arguments must be buffers
        try {
            hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
            // timingSafeEqual will return an error if the input buffers are not the same length.
        } catch (e) {
            hashEquals = false;
        };

        if (!hashEquals) {
            return res.status(400).send('HMAC validation failed');
        }

        /** HMAC Validation */ 
        const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
        const accessTokenPayload = {
            client_id: apiKey,
            client_secret: apiSecret,
            code
        };

        request.post(accessTokenRequestUrl, { json: accessTokenPayload })
            .then(async (accessTokenResponse) => {
                accessToken = accessTokenResponse.access_token;
                console.log(accessToken);
                const shopRequestUrl = 'https://' + shop + '/admin/api/2020-01/shop.json';
                const shopRequestHeaders = {
                    'X-Shopify-Access-Token': accessToken,
                };

                /*Get Shopify Shop Data */
                request.get(shopRequestUrl, { headers: shopRequestHeaders })
                    .then((shopResponse) => {
                        res.end(shopResponse);
                    })
                    .catch((error) => {
                        res.status(error.statusCode).send(error.error.error_description);
                    });
                
                
                await indexDetails.syncProducts(accessToken);  
              
                const syncPrices = cron.schedule("0 0,6,15,20 * * *", async () => {await indexDetails.syncPriceQuantity(accessToken, "prices");} , {
                    scheduled: true,
                    timezone: "America/New_York"
                });
                const syncQuantities = cron.schedule("0 * * * *", async () => {await indexDetails.syncPriceQuantity(accessToken, "quantity");}, {
                    scheduled: true,
                    timezone: "America/New_York"
                });
                const syncProducts = cron.schedule("0 0 * * *", async () => {await indexDetails.syncProducts(accessToken);}, {
                    scheduled: true,
                    timezone: "America/New_York"
                });
                syncPrices.start();    
                syncQuantities.start();   
                syncProducts.start();   

            })
            .catch((error) => {
                res.status(error.statusCode).send(error.error_description);
            });
    } else {
        res.status(400).send('Required parameters missing');
    }
});


module.exports = {
    accessToken: accessToken
};

