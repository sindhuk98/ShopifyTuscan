/**Add the Required NPM Modules */
const request = require('request-promise');

/**Add the Required App Modules */
const constants = require('./constants')
const skus = require('./products');

/**SkuInfo Url Endpoint Definition */
const skuApiOptions = {
    headers: constants.authorization,
    method: 'Get',
    json: true // Automatically stringifies the body to JSON
};

const getSkuDetails = async (skuEndpoint) => {
    const res = await request(skuEndpoint, skuApiOptions);
    return res;
        // await console.log(num + " SkuName: " + res.response.name, "Color: " + res.response.color);
}


exports.getSkuDetails = getSkuDetails;
// var arr = [];
// var len = oFullResponse.results.length;
// for (var i = 0; i < len; i++) {
//     arr.push({
//         key: oFullResponse.results[i].label,
//         sortable: true,
//         resizeable: true
//     });
// }