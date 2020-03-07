const request = require('request-promise');
const constants = require('./constants');


const getVariantInfo = async(accessToken) => {
    const productVariantInfo = await request.get(constants.getProductFieldsUrl, { headers: { 'X-Shopify-Access-Token': accessToken }, json: true });
    return productVariantInfo;
}

const putVariantInfo = async (accessToken,price) => {
    const updated_variant = {
        "variant": {
          "price": price
        }
      }
    console.log("id: " + variant.id);  
    const putOptions = {
        method: 'PUT',
        uri: constants.variantRequestUrl + variant.id + ".json",
        json: true,
        headers: {
            'X-Shopify-Access-Token': accessToken, //hardcode for time-being************************
            'content-type': 'application/json'
        },
        body: updated_variant
    };
    await request(putOptions);
}


const putVariantImages = (productPostResponse, accessToken) => {
    let idx = 0;
    for (variant of productPostResponse.product.variants) {
        if (productPostResponse.product.images[idx] !== undefined) {
            console.log("variantid: " + variant.id);
            const imageid = productPostResponse.product.images[idx].id;
            console.log("imageid: " + imageid);
            const new_image = {
                variant: {
                    "id": variant.id,
                    "image_id": imageid
                }
            }
            const putOptions = {
                method: 'PUT',
                uri: constants.variantRequestUrl + variant.id + ".json",
                json: true,
                headers: {
                    'X-Shopify-Access-Token': accessToken, //hardcode for time-being************************
                    'content-type': 'application/json'
                },
                body: new_image
            };
            request(putOptions);
            idx++;
        }
    }
}

const deleteVariant = async (variantId, accessToken) => {
    const deleteOptions = {
        method: 'DELETE',
        uri: constants.variantRequestUrl + "/"+ variantId + ".json",
        json: true,
        headers: {
            'X-Shopify-Access-Token': accessToken, //hardcode for time-being************************
            'content-type': 'application/json'
        }
    };
    await request(deleteOptions);
}

const postVariant = async(productId,accessToken) => {

}

module.exports = {
    putVariantImages: putVariantImages,
    getVariantInfo: getVariantInfo,
    putVariantInfo: putVariantInfo,
    deleteVariant: deleteVariant
}