const productsMod = require('./Tuscan/products');
const categoriesMod = require('./Tuscan/categories');
const skusMod = require('./Tuscan/sku');
const postShopifyMod = require('./Shopify/product');
const putShopifyMod = require('./Shopify/variantImages');
const putInventoryMod = require('./Shopify/Inventory');
// const installDetails = require('./install');
const request = require('request-promise');

// console.log(process.env);

const runProject = async (accessToken) => {
    const categories = await categoriesMod.getCatergories();
    for (const category of categories) {
        if (category.products !== undefined) {
            const prodBodyAndSkuEndPoints = await productsMod.getProductsCodesSkuEndPoints(category);
            for (const varEndPoints of prodBodyAndSkuEndPoints) {
                const shopifyProduct = await skusMod.getSkuDetails(varEndPoints, category.name);
                console.log("POSTING:");
                // console.log(shopifyProduct);
                const res = await postShopifyMod.postProds(shopifyProduct, accessToken);
                await putShopifyMod.putVariantImages(res, accessToken);
            }
        }

    }

};

const syncPriceQuantity = async (accessToken) => {
    const productVariants = await putShopifyMod.getVariantInfo(accessToken);
    for (variants of productVariants.products) {
        for (variant of variants.variants) {
            console.log(variant.sku);
            const skuResponse = await skusMod.requestUpdateSkuDetails(variant.sku);
            const price = skuResponse.response.prices.list.default;
            const quantity = skuResponse.response.available_quantity;
            if (price !== variant.price) {
                console.log("price changed")
                await putShopifyMod.putVariantInfo(accessToken,price);
            }
            if(quantity !== variant.inventory_quantity) {
                console.log("quantity changed")
                //const adjustment = quantity - variant.inventory_quantity;
                await putInventoryMod.putInventoryInfo(accessToken,variant.inventory_item_id,quantity);
            }
            console.log(variant.sku + "Tuscany price: " + price + "Shopify price: " + variant.price);
            console.log(variant.sku + "Tuscany quantity: " + quantity + "Shopify quantity: " + variant.inventory_quantity);
        }
    }
}
//syncPriceQuantity('abc');
//runProject('abc');

module.exports = {
    runProject: runProject,
    syncPriceQuantity: syncPriceQuantity
}