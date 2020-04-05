/**Add the Required NPM Modules */
const request = require('request-promise');

/** Include required files */
const constants = require('./constants')

/**SkuInfo Url Endpoint Definition */
const skuApiOptions = {
    headers: constants.authorization,
    method: 'Get',
    json: true // Automatically stringifies the body to JSON
};

const skuDetails = async (sku) => {
    const skuResponse = await request(constants.skuRequestUrl + sku+"&currency=GBP", skuApiOptions)
    return skuResponse;
}

const createNewVariant = (skuResponse, skuCode) => {
    const new_variant = {// DO NOT APPEND {variant: ...}
        "option1": skuResponse.response.color,
        // "inventory_quantity": skuResponse.response.available_quantity,
        "sku": skuCode,
        "price": skuResponse.response.prices.list.default,
        "barcode": skuResponse.response.ean,
        "inventory_policy": "continue",
        "inventory_management": "shopify",
        "presentment_prices": [
            {
              "price": {
                "currency_code": "GBP",
                "amount": skuResponse.response.prices.list.default
              },
              "compare_at_price": {
                "currency_code": "GBP",
                "amount": skuResponse.response.prices.list.default
              }
            }
          ]
    }
    return new_variant;
}

/**Async Method to call the sku endpoint */
//prodBodyAndSkuURLs is an object?YES
//ex: {body_html: "string", prodEndpoint: [{sku: "string", details_endpoint: "urlstring"}, ... ], product_code: "string"}
//FOR POSTING:
const getShopifyProduct = async (prodBodyAndSkuURLs, categName) => {
    /**Variants to hold the SKU Variants for Shopify */
    let variants = [];
    let images = [];
    let additionalImages =[];
    let tags = [];
    let sku;
    for (const skuEndpoint of prodBodyAndSkuURLs.endpoints) {
        /**Get SKU info for each Sku endpoint of a product */
       // sku = await request(skuEndpoint.details_endpoint, skuApiOptions); // REVISIT: call skuDetails instead**********
       sku = await skuDetails(skuEndpoint.sku);
        /**Checks if sku is saleable */
        if (sku.response.saleable) {
            /** Define tags for product */
            tags.push(sku.response.color);

            /** Create a new variant object and push into variants[] for each sku of a product */
            let new_variant = createNewVariant(sku,skuEndpoint.sku);
            new_variant["inventory_quantity"] = sku.response.available_quantity;
            variants.push(new_variant);

            /**Buffer the base64 data from the Main Image URL obtained from sku response */
            console.log(sku.response.main_image.url, sku.response.name);
            images.push(await getImageData(sku.response.main_image.url));
            // for(extraImages of sku.response.additional_images){
            //     additionalImages.push(await getImageData(extraImages.url));
            //     // console.log(additionalImages);
            // }
        }
    }
    // images = images.concat(additionalImages);
    
    if (variants[0] !== undefined) {
        /**Create the Shopify Product to be posted and Return it */
        const shopifyProduct = {
            "product": {
                "title": sku.response.name,
                "body_html": prodBodyAndSkuURLs.body_html,
                "vendor": "Tuscany Leather",
                "product_type": categName, //categName cascade from categories (too many async calls:-- or store in main function)
                "handle": prodBodyAndSkuURLs.product_code, //replace with product(param)
                "tags": tags.join(","),
                "variants": variants,
                "options": [{ name: "Color", "position": 1 }],
                "images": images
            }
        }
        return shopifyProduct;

    } else {
        return undefined;
    }


}



/**Async function that gets the base64 data from the image url endpoint */
const getImageData = async (url) => {
    const getImageOptions = {
        url: url,
        encoding: null,
        // resolveWithFullResponse: true,
        method: 'Get'
    };
    try {
        const imgDataRes = await request(getImageOptions);
        if (imgDataRes.toString('base64') !== undefined) {
            return {
                attachment: imgDataRes.toString('base64'),
                "filename": "test.jpg"
            };
        } else {
            return {
                attachment: "",
                "filename": "test.jpg"
            };
        }
    }
    catch (error) {
        //do nothing
    }

}

const skuUpdateDetails = async (updateParam) => {
    if (updateParam === "prices") {
        const updatedPrices = await request(constants.requestUrl + "item-prices", skuApiOptions);
        return updatedPrices;
    } else if (updateParam === "quantity") {
        const updatedQuantity = await request(constants.requestUrl + "items-availability", skuApiOptions);
        return updatedQuantity;
    }
    return 0;

}

module.exports = {
    getShopifyProduct,
    getImageData,
    skuUpdateDetails,
    skuDetails,
    createNewVariant
}
