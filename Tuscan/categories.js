/**Add the Required NPM Modules */
const request = require('request-promise');

/**Add the Required App Modules */
const constants = require('./constants')
/*Get Tuscan API Categories */
/**Integrate TuscanLeather Products to Shopify Store-ShangrilaFashion.
 * Use Production URL While deploying to production
 * TuscanLeater Products Can be Obtained by cycling through the Categories followed by the product-info followed
 * by the sku.
 * This File andles the categories API call.
 */

/**Categories Endpoint */
const categoryRequestUrl = constants.requestUrl + 'categories';

/**Categories API Headers */
let categoriesApiOptions = {
    uri: categoryRequestUrl,
    headers: constants.authorization,
    method: 'Get',
    json: true // Automatically stringifies the body to JSON
};

/**Async function to call the categories API Using the request promise package. */
const getCatergories = async () => {
    let categoriesList = [];
    try {
        const categoriesResponse = await request(categoriesApiOptions);
        const categories = categoriesResponse.response.slice(0, 2);

        return categories;
    }
    catch (error) {
        return error;
    }
};

exports.getCatergories = getCatergories;