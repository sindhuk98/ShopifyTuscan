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
    const skuResponse = await request(constants.skuRequestUrl+sku, skuApiOptions);
    return skuResponse;
}


/**Async Method to call the sku endpoint */
//prodBodyAndSkuURLs is an object?YES
//ex: {body_html: "string", prodEndpoint: [{sku: "string", details_endpoint: "urlstring"}, ... ], product_code: "string"}
//FOR POSTING:
const getSkuDetails = async (prodBodyAndSkuURLs, categName) => {
    /**Variants to hold the SKU Variants for Shopify */
    let variants = [];
    let images = [];
    let sku;
    for (const skuEndpoint of prodBodyAndSkuURLs.endpoints) {
        /**Get SKU info for each Sku endpoint of a product */
        sku = await request(skuEndpoint.details_endpoint, skuApiOptions); // REVISIT: call skuDetails instead**********
        /**Checks if sku is saleable */
        if (sku.response.saleable){
            /** Define a new variant object for each sku of a product */
            variants.push(
                {
                    "option1": sku.response.color,
                    "inventory_quantity": sku.response.available_quantity,
                    "sku": skuEndpoint.sku,
                    "price": sku.response.prices.list.default,
                    "barcode": sku.response.ean,
                    "inventory_policy": "continue",
                    "inventory_management": "shopify"
                }
            );
            /** ^^^ THIS IS NOT A PRODUCT YET */
    
    
            /**Buffer the base64 data from the Main Image URL obtained from sku response */
            let imageBufferData = await getImageData(sku.response.main_image.url);
            if (imageBufferData === undefined) {
                imageBufferData = "";
            }
            console.log(sku.response.main_image.url,sku.response.name);
            images.push(
                {
                    "attachment": imageBufferData,
                    "filename": "test.jpg"
                }
            )
        }
        

    }

    if (variants[0] !== undefined) {
        /**Create the Shopify Product to be posted and Return it */
        const shopifyProduct = {
            "product": {
                "title": sku.response.name,
                "body_html": prodBodyAndSkuURLs.body_html,
                "vendor": "Tuscany Leather",
                "product_type": categName, //categName cascade from categories (too many async calls:-- or store in main function)
                "handle": prodBodyAndSkuURLs.product_code, //replace with product(param)
                "tags": "",
                "variants": variants,
                "options": [{name: "Color", "position": 1}],
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
        return imgDataRes.toString('base64');
    }
    catch (error) {
        //do nothing
    }

}

const skuUpdateDetails = async(updateParam) => {
    if(updateParam === "prices"){
        const updatedPrices = await request(constants.requestUrl + "item-prices", skuApiOptions);
        return updatedPrices;    
    } else if (updateParam === "quantity") {
        const updatedQuantity = await request(constants.requestUrl + "items-availability", skuApiOptions);
        return updatedQuantity;
    }
    return 0;
    
}

module.exports = {
    getSkuDetails: getSkuDetails,
    getImageData: getImageData,
    skuUpdateDetails: skuUpdateDetails,
    skuDetails: skuDetails
}
