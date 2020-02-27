const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const crypto = require('crypto');
const cookie = require('cookie');
const nonce = require('nonce')();
const querystring = require('querystring');
const request = require('request-promise');

const productsMod = require('./Tuscan/products');
const skusMod = require('./Tuscan/sku');



(async () => {
    const results = await productsMod.getProductsCodesSkuEndPoints();

    for (const result of results) {
        const res = await skusMod.getSkuDetails(result);
            console.log(res);

    }

})();



/****************************************************************************
const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const port = process.env.PORT || 3000;
const scopes = 'read_products,write_products';
const forwardingAddress = "https://ba17b958.ngrok.io"; // Replace this with your HTTPS Forwarding address
let accessToken = '';

app.get('/', (req, res) => {
    res.send('Welcome to My ShopifyTuscanLeather Store!');
});

app.listen(port, () => {
    console.log('ShopifyTuscanLeather listening on port 3000!');
});

/**Install Route 
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

/**Callback Route 
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

        /** HMAC Validation
        const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
        const accessTokenPayload = {
            client_id: apiKey,
            client_secret: apiSecret,
            code
        };

        request.post(accessTokenRequestUrl, { json: accessTokenPayload })
            .then((accessTokenResponse) => {
                accessToken = accessTokenResponse.access_token;
                const shopRequestUrl = 'https://' + shop + '/admin/api/2020-01/shop.json';
                const shopRequestHeaders = {
                    'X-Shopify-Access-Token': accessToken,
                };

                /*Get Shopiy Shop Data 
                request.get(shopRequestUrl, { headers: shopRequestHeaders })
                    .then((shopResponse) => {
                        res.end(shopResponse);
                    })
                    .catch((error) => {
                        res.status(error.statusCode).send(error.error.error_description);
                    });

            })
            .catch((error) => {
                res.status(error.statusCode).send(error.error.error_description);
            });
    } else {
        res.status(400).send('Required parameters missing');
    }
});


/*Get Tuscan API Categories 
const requestUrl = "https://stage.tuscanyleather.it/api/v1/";
const categoryRequestUrl = requestUrl + 'categories';
const productRequestUrl = requestUrl + 'product-info?code='
let tuscanApiOptions = {
    uri: categoryRequestUrl,
    headers: {
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjE2NjY2OCwiaXNzIjoiaHR0cHM6Ly93d3cudHVzY2FueWxlYXRoZXIuaXQvcmVmcmVzaC1hcGktdG9rZW4iLCJpYXQiOjE1ODE5MDIzNTMsImV4cCI6MTg5NzI2MjM1MywibmJmIjoxNTgxOTAyMzUzLCJqdGkiOiJ2aW5LdlpIUmZJUTZlc3BhIn0.FP9_TgqsunJBNSXkIz4zRWYAIRKjtS11ptGrSCy4v3Y'
    },
    method: 'Get',
    json: true // Automatically stringifies the body to JSON
};

let productApiOptions = {
    headers: {
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjE2NjY2OCwiaXNzIjoiaHR0cHM6Ly93d3cudHVzY2FueWxlYXRoZXIuaXQvcmVmcmVzaC1hcGktdG9rZW4iLCJpYXQiOjE1ODE5MDIzNTMsImV4cCI6MTg5NzI2MjM1MywibmJmIjoxNTgxOTAyMzUzLCJqdGkiOiJ2aW5LdlpIUmZJUTZlc3BhIn0.FP9_TgqsunJBNSXkIz4zRWYAIRKjtS11ptGrSCy4v3Y'
    },
    method: 'Get',
    json: true // Automatically stringifies the body to JSON
};

let num = 1;
//var BreakException = {};
const getCatergories = async () => {
    try {
        const categories = await request(tuscanApiOptions);
        let sample = categories.response.slice(0,1);
        //console.log(sample);

        sample.forEach((category) => {
            // if (num >= 20) throw BreakException;
            if (category.products !== undefined) {
                let products = category.products;
                //console.log(products);
                products.forEach((product) => {
                   // num++;
                    //if (num >= 20) throw BreakException;
                  getProducts(product);
                // console.log(products);
                });

            }
        });
    }
    catch (e) {
        console.log(e);
    }
};

const getProducts = async (productcode) => {
    try{
        const products = await request(productRequestUrl + productcode, productApiOptions);
        console.log(products.response);
    }
    catch(e){
        console.log(num++ +"product err "+ e);
    }
 
}

getCatergories();
***/
/******************************* ************************************************************************
let shopifyProduct = [];
const getProducts = async (productcode) => {
    await request(productRequestUrl + productcode, productApiOptions).then((prod) => {
        //console.log(prod.response.items);
        let products = prod.response.items;
        // try {
        products.forEach((product) => {
            num++;
            // if (num >= 20) throw BreakException;
            await getSku(product.details_endpoint);

            //r.push(item.details_endpoint);
        });
        // }
        // catch (e) {
        //     console.log("throw catch for sku")
        // }

    }).catch((err) => {
        console.log("product err");
    });

}

const getSku = async (skuEndpoint) => {
    await request(skuEndpoint, productApiOptions).then((sku) => {
        console.log(num + " SkuName: " + sku.response.name, "Color: " + sku.response.color);
        shopifyProduct.push({
            product: {
                "title": sku.response.name,
                "body_html": "<p>The epitome of elegance</p>",
                "vendor": "Tuscany Leather",
                "product_type": "Planets",
                "handle": "saturn",
                "tags": "",
                "images": [
                    {
                        "src": "https://solarsystem.nasa.gov/system/stellar_items/image_files/38_saturn_1600x900.jpg"
                    }
                ]
            }
        });
    }).catch((err) => {
        console.log(err);
    });

}


************************************************************************************************* */
// categories.response.forEach((category) =>{
//     console.log(category.name);
// })
/*
let ps = [];
let n =1;
request(tuscanApiOptions)
    .then((categResponse) => {
        //res.end(categResponse);  

        categResponse.response.forEach((category) => {
            if (category.products !== undefined) {
                category.products.forEach((product) => {
                    let productApiOptions = {
                        uri: requestUrl + `product-info?code=${product}`,
                        headers: {
                            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjE2NjY2OCwiaXNzIjoiaHR0cHM6Ly93d3cudHVzY2FueWxlYXRoZXIuaXQvcmVmcmVzaC1hcGktdG9rZW4iLCJpYXQiOjE1ODE5MDIzNTMsImV4cCI6MTg5NzI2MjM1MywibmJmIjoxNTgxOTAyMzUzLCJqdGkiOiJ2aW5LdlpIUmZJUTZlc3BhIn0.FP9_TgqsunJBNSXkIz4zRWYAIRKjtS11ptGrSCy4v3Y'
                        },
                        method: 'Get',
                        json: true // Automatically stringifies the body to JSON
                    };
                    ps.push(request(productApiOptions));
                });
                var b = ps.splice(0,1);
                console.log(b);
                // Promise.allSettled(b)
                //     .then((values) => {
                        
                //            // console.log(n++ +")", values);
                //     })
                //     .catch((err) => {
                //        // console.log("err "+ n++);
                //     })
            }
        })
    })
    .catch((error) => {
        console.log(error);
        //res.status(error.statusCode).send(error.error.error_description);
    });



*/
