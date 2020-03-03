const productsMod = require('./Tuscan/products');
const categoriesMod = require('./Tuscan/categories');
const skusMod = require('./Tuscan/sku');
const postShopifyMod = require('./Shopify/product');
const putImagesShopifyMod = require('./Shopify/variantImages');
// const installDetails = require('./install');


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
                await putImagesShopifyMod.putVariantImages(res, accessToken);
            }
        }

    }

};

//runProject('abc');

exports.runProject = runProject;