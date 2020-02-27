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

const getSkuDetails = async (skuEndpoints) => {
    /**Variants to hold the SKU Variants for Shopify */
    let variants = [];
    let sku;
    for (const skuEndpoint of skuEndpoints) {
        sku = await request(skuEndpoint, skuApiOptions);

        variants.push(
            {
                "option1": sku.response.color,
                "inventory_quantity": sku.response.available_quantity,
                "inventory_policy": "continue",
                "inventory_management": "shopify"
            }
        )
    }
    

    /**Buffer the base64 data from the Main Image URL obtained from sku response */
    // NOT TESTED - image functions
    console.log(sku.response.main_image.url);
    let imageBufferData = await getImageData(sku.response.main_image.url);
    // console.log(imageBufferData);
    if (imageBufferData === undefined) {
        imageBufferData = "";
    }
    
    /**Create the shopify products and Return it */
    const shopifyProduct = {
        "product": {
            "title": sku.response.name,
            "body_html": "<p>The epitome of elegance</p>",
            "vendor": "Tuscany Leather",
            "product_type": "categType", //categType cascade from categories (too many async calls:-- or store in main function)
            "handle": "saturn",
            "tags": "",
            "variants": variants,
            "images": [
                {
                    "attachment": imageBufferData,
                    "filename": 'test.jpg'
                }
            ]
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
