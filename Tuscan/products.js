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

/** getProductCodes: Is an Asyn function that returns all the productcodes for all the categories
 * One Category can have many product codes
 * One to Many -- Category to Products
*/
const getProductCodes = async () => {
    const productCodes = [];
    const categoriesList = await categories.getCatergories();
    for (const category of categoriesList) {
        productCodes.push(category.products);
        //console.log(category.products);
    }
    return productCodes.flat();
}

/** getProductsCodesSkuEndPoints: Is an Asyn function that returns all the sku endpoints for all the products
 * One Product can have many Sku's
 * One to Many -- Product to Sku's
*/
const getProductsCodesSkuEndPoints = async () => {
    let skuEndPoint = [];
    const productsList = await getProductCodes();

    for (const product of productsList) {
        let productResponse = await request(productRequestUrl + product, productApiOptions);
        //skuEndPoint.push(productResponse.response.items);
        productResponse.response.items.map((items) => {
            skuEndPoint.push(items.details_endpoint)
        });
    }
    return skuEndPoint;
}


module.exports = {
    getProductCodes: getProductCodes,
    getProductsCodesSkuEndPoints: getProductsCodesSkuEndPoints
}









// productsList.map((product) => {
//     let productResponse = await getProduct(product);
//     skuEndPoint = productResponse.response.items.map((item) => {
//         item.details_endpoint
//     })

// });