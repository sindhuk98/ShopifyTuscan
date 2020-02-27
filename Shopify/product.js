/**Add the Required NPM Modules */
const request = require('request-promise');

const postRequestUrl = 'https://tuscstore.myshopify.com/admin/api/2020-01/products.json';


/* SHOPIFY's POST call */
// essentially posts a single product - multiple SKUs
const postProds = async (new_product) => {
    const postOptions = {
        method: 'POST',
        uri: postRequestUrl,
        json: true,
        headers: {
            'X-Shopify-Access-Token': '9bb05e6565af3b700d7e29b1f05c820e', //hardcode for time-being************************
            'content-type': 'application/json'
        },
        body: new_product
    };
    await request(postOptions)
};

   module.exports = {
    postProds: postProds
}