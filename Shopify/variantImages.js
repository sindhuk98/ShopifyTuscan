const request = require('request-promise');
const constants = require('./constants');

const putVariantImages = async(productPostResponse, accessToken) => {
    let idx = 0;
    for (variant of productPostResponse.product.variants) {
        if (productPostResponse.product.images[n] !== undefined) {
            console.log("variantid: " + variant.id);
            const imageid = productPostResponse.product.images[n].id;
            console.log("imageid: " + imageid);
            const new_image = {
                variant: {
                    "id": variant.id,
                    "image_id": imageid
                }
            }
            const putOptions = {
                method: 'PUT',
                uri: constants.putRequestUrl + variant.id + ".json",
                json: true,
                headers: {
                    'X-Shopify-Access-Token': accessToken, //hardcode for time-being************************
                    'content-type': 'application/json'
                },
                body: new_image
            };
            await request(putOptions);
            idx++;
        }
    }
}

module.exports = {
    putVariantImages: putVariantImages
}