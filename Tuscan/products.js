/**Add the Required NPM Modules */
const request = require('request-promise');

/**Add the Required App Modules */
const constants = require('./constants')
const categories = require('./categories');

/**Prodcuinfo Url Endpoint Definition */
let productRequestUrl = constants.requestUrl + 'product-info?code='
const productApiOptions = {
    headers: constants.authorization,
    method: 'Get',
    json: true // Automatically stringifies the body to JSON
};


/** getProductsCodesSkuEndPoints: Is an Asyn function that returns all the sku endpoints for all the products
 * One Product can have many Sku's
 * One to Many -- Product to Sku's
*/
const getProductsCodesSkuEndPoints = async (category) => {
    let skuEndPoint = [];
    const productsList = category.products;

    for (const product of productsList) {
            let prodEndPoint = [];
            let productResponse = await request(productRequestUrl + product, productApiOptions);
            //skuEndPoint.push(productResponse.response.items);
            productResponse.response.items.map((items) => {
                prodEndPoint.push(items);
            });
            skuEndPoint.push(prodEndPoint);
    }
    return skuEndPoint;
}

exports.getProductsCodesSkuEndPoints = getProductsCodesSkuEndPoints;