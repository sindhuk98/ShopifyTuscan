/**Add the Required NPM Modules */
const request = require('request-promise');

/** Include required files */
const constants = require('./constants')

/**Prodcuinfo Url Endpoint Definition */
let productRequestUrl = constants.requestUrl + 'product-info?code='
const productApiOptions = {
    headers: constants.authorization,
    method: 'Get',
    json: true // Automatically stringifies the body to JSON
};

const getProductInfo = async(productCode) => {
    const product = await request(productRequestUrl + productCode, productApiOptions);
    return product;
}

/** getProductsCodesSkuEndPoints: Is an Asyn function that returns all the sku endpoints for all the products
 * One Product can have many Sku's
 * One to Many -- Product to Sku's
*/
const getProductsCodesSkuEndPoints = async (product) => {

            let productResponse = await getProductInfo(product);
            //skuEndPoint.push(productResponse.response.items);

            /**pushing prodEndPoint: [{sku: 1911_1, details_endpoint: sku_url}, ...]*/
            const prodSkusEndPoints = productResponse.response.items;
            
            const body = createProductDescription(productResponse);
            
            const prodBodyAndSkuEndPoints = {
                "body_html": body,
                "endpoints": prodSkusEndPoints,
                "product_code": productResponse.response.code //remove product_code because product(param)****************************
            }
    return prodBodyAndSkuEndPoints;
}

const createProductDescription = ((productResponse) => {
    const length = JSON.stringify(productResponse.response.dimensions.product.length).replace(/"/g,'');
    const height = JSON.stringify(productResponse.response.dimensions.product.height).replace(/"/g,'');
    const width = JSON.stringify(productResponse.response.dimensions.product.width).replace(/"/g,'');
    const dimensionValue = width + " x " + height + " x " + length + " cm";
    const weightValue = JSON.stringify(productResponse.response.dimensions.product.weight).replace(/"/g,'') + " kg";
    const featuresObj = productResponse.response.features;

    let dimensionDesc = "<b>Product Measurements: </b>" + "<br>" + "- Dimensions: " + dimensionValue + "<br>" + "- Weight: " + weightValue + "<br><br>";

    //body description
    const productDetails = Object.keys(featuresObj).reduce((finalKey,currKey) => {
        //Keys for features inside productResponse ex: Hardware, Composition etc.
        finalKey += "<b>" + currKey + ": " + "</b>"+ "<br>";
        
        //Values for each key within the features ex: Smooth Leather, etc.
        const productValues = featuresObj[currKey].reduce((finalValue, currValue) => {
            finalValue += "- " + currValue + "<br>";
            return finalValue;
        }, finalKey)
        finalKey = productValues + "<br>";

        return finalKey;
    }, dimensionDesc);
    // console.log(productDetails);
    return productDetails;
});

module.exports = {
    getProductsCodesSkuEndPoints: getProductsCodesSkuEndPoints,
    getProductInfo: getProductInfo
  };