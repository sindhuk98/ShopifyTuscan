const productsMod = require('./Tuscan/products');
const categoriesMod = require('./Tuscan/categories');
const skusMod = require('./Tuscan/sku');
const postShopifyMod = require('./Shopify/product');
// const installDetails = require('./install');


// console.log(process.env);

const runProject = async (accessToken) => {
    const categories = await categoriesMod.getCatergories();
    for (const category of categories) {
        if (category.products !== undefined) {
            const prodEndPoints = await productsMod.getProductsCodesSkuEndPoints(category);
            for (const varEndPoints of prodEndPoints) {
                const shopifyProduct = await skusMod.getSkuDetails(varEndPoints, category.name);
                // console.log("POSTING:");
                // console.log(shopifyProduct);
                await postShopifyMod.postProds(shopifyProduct, accessToken);
            }
        }

    }

};

exports.runProject = runProject;