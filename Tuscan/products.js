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
    let prodBodyAndSkuEndPoints = [];
    const productsList = category.products;

    for (const product of productsList) {
            let prodEndPoint = [];
            let productResponse = await request(productRequestUrl + product, productApiOptions);
            //skuEndPoint.push(productResponse.response.items);
            productResponse.response.items.map((items) => {
                prodEndPoint.push(items);
            });
            const body = createProductDescription(productResponse);
            const obj = {
                "body_html": body,
                "endpoints": prodEndPoint
            }
            
            prodBodyAndSkuEndPoints.push(obj);
    }

    return prodBodyAndSkuEndPoints;
}

const createProductDescription = ((productResponse) => {
    const length = JSON.stringify(productResponse.response.dimensions.product.length).replace(/"/g,'');
    const height = JSON.stringify(productResponse.response.dimensions.product.height).replace(/"/g,'');
    const width = JSON.stringify(productResponse.response.dimensions.product.width).replace(/"/g,'');
    const dimensionValue = length + " x " + width + " x " + height + " cm";
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

exports.getProductsCodesSkuEndPoints = getProductsCodesSkuEndPoints;