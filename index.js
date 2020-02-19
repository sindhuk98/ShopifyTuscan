const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const crypto = require('crypto');
const cookie = require('cookie');
const nonce = require('nonce')();
const querystring = require('querystring');
const request = require('request-promise');

const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const port = process.env.PORT || 3000;
const scopes = 'read_products,write_products';
const forwardingAddress = "https://shopifytuscan.herokuapp.com"; // Replace this with your HTTPS Forwarding address


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log('Example app listening on port 3000!');
});


/**Install Route */
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
        res.redirect(installUrl);
    } else {
        return res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request');
    }
});

/**Callback Route */
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

        /** HMAC Validation*/
        const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
        const accessTokenPayload = {
            client_id: apiKey,
            client_secret: apiSecret,
            code,
        };

        request.post(accessTokenRequestUrl, { json: accessTokenPayload })
            .then((accessTokenResponse) => {
                const accessToken = accessTokenResponse.access_token;

                const shopRequestUrl = 'https://' + shop + '/admin/api/2020-01/shop.json';
                const shopRequestHeaders = {
                    'X-Shopify-Access-Token': accessToken,
                };

                request.get(shopRequestUrl, { headers: shopRequestHeaders })
                    .then((shopResponse) => {
                        res.end(shopResponse);
                    })
                    .catch((error) => {
                        res.status(error.statusCode).send(error.error.error_description);
                    });

                /**POST PRODUCT START */
                var obj = {
                    "product":
                        {
                            "title": "Saturn",
                            "body_html": "<p>The epitome of elegance</p>",
                            "vendor": "Sabarish",
                            "product_type": "Planets",
                            "handle": "saturn",
                            "tags": "",
                            "images": [
                                {
                                    "src": "https://solarsystem.nasa.gov/system/stellar_items/image_files/38_saturn_1600x900.jpg"
                                }
                            ]
                        }
                    
                }
                const productRequestUrl = 'https://' + shop + '/admin/api/2020-01/products.json';
                let options = {
                    body: {
                        "data":JSON.stringify(obj)
                    },
                    headers: {
                        'X-Shopify-Access-Token': accessToken,
                    }
                };
                request.post(productRequestUrl,options)
                .then((shopResponse) => {
                    res.end(shopResponse);
                })
                .catch((error) => {
                    res.status(error.statusCode).send(error.error.error_description);
                });

                /**POST PRODUCT END */

                // TODO
                // Use access token to make API call to 'shop' endpoint
            })
            .catch((error) => {
                res.status(error.statusCode).send(error.error.error_description);
            });
        /** */

        // TODO
        // Validate request is from Shopify
        // Exchange temporary code for a permanent access token
        // Use access token to make API call to 'shop' endpoint
    } else {
        res.status(400).send('Required parameters missing');
    }
});

