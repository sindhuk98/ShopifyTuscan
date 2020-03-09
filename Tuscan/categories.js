/**Add the Required NPM Modules */
const request = require('request-promise');

/** Include required files */
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
    try {
        const categoriesResponse = await request(categoriesApiOptions);
        const categories = categoriesResponse.response;  //REMOVE SLICE*****************************************************
        return categories;
    }
    catch (error) {
        return error;
    }
};

const getProductCodes = async () => {
    const productCodes = [];
    const categoriesList = await getCatergories();
    categoriesList.flat();
    for (const category of categoriesList) {
        if (category.products !== undefined) {
            const categoryProductCodes = {
                categoryName: category.name,
                categProducts: category.products
            }
            productCodes.push(categoryProductCodes);
            // productCodes.push(category.products)
        }
    }
    return productCodes;
    // return productCodes.flat();
}

module.exports = {
    getCatergories,
    getProductCodes
  };