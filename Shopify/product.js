/**Add the Required NPM Modules */
const request = require('request-promise');

const constants = require('./constants')

const getProductFieldInfo = async(accessToken) => {
        //const productIdHandleVariants = await request.get(constants.getProductFieldsUrl, { headers: { 'X-Shopify-Access-Token': accessToken }, json: true });
        return await request.get(constants.getProductFieldsUrl, { headers: { 'X-Shopify-Access-Token': accessToken }, json: true })
        //return productIdHandleVariants;   
}

const getProductTags = async(accessToken,productId) => {
    const getOptions = {
        method: 'GET',
        uri: constants.prodRequestUrl + "/"+ productId + ".json?vendor=Tuscany%20Leather&fields=tags",
        json: true,
        headers: {
            'X-Shopify-Access-Token': accessToken,
            'content-type': 'application/json'
        }
    };
    const productTags = await request(getOptions);
    return productTags.product;
}

const putProductInfo = async(accessToken,productId,updated_product) => {
    const putOptions = {
        method: 'PUT',
        uri: constants.prodRequestUrl + "/"+ productId + ".json",
        json: true,
        headers: {
            'X-Shopify-Access-Token': accessToken,
            'content-type': 'application/json'
        },
        body: updated_product
    };
    await request(putOptions);
}

const deleteProds = async(productCode, accessToken) => {
    const deleteOptions = {
        method: 'DELETE',
        uri: constants.prodRequestUrl + "/"+ productCode + ".json",
        json: true,
        headers: {
            'X-Shopify-Access-Token': accessToken,
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
    postProds,
    deleteProds,
    getProductFieldInfo,
    getProductTags,
    putProductInfo
}
