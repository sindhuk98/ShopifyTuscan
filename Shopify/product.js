/**Add the Required NPM Modules */
const request = require('request-promise');

const constants = require('./constants')


/** Helper Function for Shopify Product API Pagination */
const nextPageLink = ((response) => {
    let linkString = "";
    if (response.headers.link && response.headers.link.includes("next")) {
        linkString = response.headers.link;
        linkString = linkString.substr(linkString.indexOf('<')+1);
        if (linkString.includes("previous")) {
            linkString = linkString.substr(linkString.indexOf(',') + 3);
        }
        linkString = linkString.substr(0,linkString.indexOf('>'));

    }
    return linkString;
}) 


/** Product API Calls through pagination */
const getProductFieldInfo = async(accessToken) => {
    let url = constants.getProductFieldsUrl;
    let productArr = [];
    const productObj = {};

    do{
        const product = await request.get(url, { headers: { 'X-Shopify-Access-Token': accessToken },resolveWithFullResponse: true, json: true })
        productArr.push(product.body.products);
        url = nextPageLink(product);
    }
    while(url!=="");

    productObj.products = productArr.flat();
    return productObj;
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
