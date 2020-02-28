/**Add the Required NPM Modules */
const request = require('request-promise');

/**Add the Required App Modules */
const constants = require('./constants')

/**SkuInfo Url Endpoint Definition */
const skuApiOptions = {
    headers: constants.authorization,
    method: 'Get',
    json: true // Automatically stringifies the body to JSON
};

/**Async Method to call the sku endpoint */
//skuEndpoints is an array?YES

const getSkuDetails = async (skuEndpoints, categType) => {
    /**Variants to hold the SKU Variants for Shopify */
    let variants = [];
    let images = [];
    let sku;
    for (const skuEndpoint of skuEndpoints) {
        sku = await request(skuEndpoint.details_endpoint, skuApiOptions);
        variants.push(
            {
                "option1": sku.response.color,
                "inventory_quantity": sku.response.available_quantity,
                "sku": skuEndpoint.sku,
                "price": sku.response.prices.list.default,
                "inventory_policy": "continue",
                "inventory_management": "shopify"
            }
        )

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
    


    // NOT TESTED - image functions
    
    /**Create the shopify products and Return it */
    const shopifyProduct = {
        "product": {
            "title": sku.response.name,
            "body_html": "<p>The epitome of elegance</p>",
            "vendor": "Tuscany Leather",
            "product_type": categType, //categType cascade from categories (too many async calls:-- or store in main function)
            "handle": "saturn",
            "tags": "",
            "variants": variants,
            "images": images
        }
    }
    return shopifyProduct;
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

module.exports = {
    getSkuDetails: getSkuDetails,
    getImageData: getImageData
}
