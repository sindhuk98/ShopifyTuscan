/**Add the Required NPM Modules */
const request = require('request-promise');

const postRequestUrl = 'https://shangri-lafashion.myshopify.com/admin/api/2020-01/products.json';


/* SHOPIFY's POST call */
// essentially posts a single product - multiple SKUs
const postProds = async (new_product, accessToken) => {
    const postOptions = {
        method: 'POST',
        uri: postRequestUrl,
        json: true,
        headers: {
            'X-Shopify-Access-Token': accessToken, //hardcode for time-being************************
            'content-type': 'application/json'
        },
        body: new_product
    };
    await request(postOptions)
};

   module.exports = {
    postProds: postProds
}
