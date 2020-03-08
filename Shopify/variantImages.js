const request = require('request-promise');
const constants = require('./constants');


const getVariantIdSku = async(accessToken) => {
    const variantIdSku = await request.get(constants.variantRequestUrl+".json?fields=id,sku", { headers: { 'X-Shopify-Access-Token': accessToken }, json: true });
    return variantIdSku.variants;
}

const postVariant = async(accessToken, productId, new_variant) => {
    const postVariantResponse = await request.post(constants.prodRequestUrl + "/" + productId + "/variants.json", { headers: { 'X-Shopify-Access-Token': accessToken }, json: true, body: new_variant })
    return postVariantResponse;
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
        uri: constants.variantRequestUrl + "/" + variant.id + ".json",
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
                uri: constants.variantRequestUrl + "/" + variant.id + ".json",
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


const deleteVariant = async (variantId, imageId, productId,accessToken) => {
    const deleteOptions = {
        method: 'DELETE',
        uri: constants.variantRequestUrl + "/"+ variantId + ".json",
        json: true,
        headers: {
            'X-Shopify-Access-Token': accessToken,
            'content-type': 'application/json'
        }
    };
    await deleteVariantImage(imageId, productId, accessToken);
    await request(deleteOptions);
}

const deleteVariantImage = async (imageId,productId,accessToken) => {
    const deleteImageOptions = {
        method: 'DELETE',
        uri: constants.prodRequestUrl + "/"+ productId + "/images/" + imageId + ".json",
        json: true,
        headers: {
            'X-Shopify-Access-Token': accessToken,
            'content-type': 'application/json'
        }
    };
    await request(deleteImageOptions);
}

const postVariantImage = async (accessToken, productId, new_image) => {
    const postOptions = {
        method: 'POST',
        uri: constants.prodRequestUrl + "/" + productId + "/images.json",
        json: true,
        headers: {
            'X-Shopify-Access-Token': accessToken, //hardcode for time-being************************
            'content-type': 'application/json'
        },
        body: new_image

    }
const postImageResponse = await request(postOptions);
return postImageResponse;
}

module.exports = {
    putVariantImages: putVariantImages,
    getVariantIdSku: getVariantIdSku,
    putVariantInfo: putVariantInfo,
    deleteVariant: deleteVariant,
    postVariant: postVariant,
    postVariantImage: postVariantImage
}