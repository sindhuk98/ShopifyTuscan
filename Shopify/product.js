/**Add the Required NPM Modules */
const request = require('request-promise');

const constants = require('./constants')

const deleteProds = async(productCode, accessToken) => {
    const deleteOptions = {
        method: 'DELETE',
        uri: constants.prodRequestUrl + "/"+ productCode + ".json",
        json: true,
        headers: {
            'X-Shopify-Access-Token': accessToken, //hardcode for time-being************************
            'content-type': 'application/json'
        }
    };
    await request(deleteOptions);
}

/* SHOPIFY's POST call */
// essentially posts a single product - multiple SKUs
const postProds = async (new_product, accessToken) => {
    const postOptions = {
        method: 'POST',
        uri: constants.prodRequestUrl + ".json",
        json: true,
        headers: {
            'X-Shopify-Access-Token': accessToken, //hardcode for time-being************************
            'content-type': 'application/json'
        },
        body: new_product
    };
    return await request(postOptions)
};

   module.exports = {
    postProds: postProds,
    deleteProds: deleteProds
}
