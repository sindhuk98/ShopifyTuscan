const productsMod = require('./Tuscan/products');
const categoriesMod = require('./Tuscan/categories');
const skusMod = require('./Tuscan/sku');
const postShopifyMod = require('./Shopify/product');
const putShopifyMod = require('./Shopify/variantImages');
const putInventoryMod = require('./Shopify/Inventory');
const cron = require("node-cron");


const syncProducts = async (accessToken) => {
    const productHandleVariants = await putShopifyMod.getVariantInfo(accessToken);
    
    /** UPDATE PRODUCTS */
    const tuscCategAndCodes = await categoriesMod.getProductCodes();
    const handles = productHandleVariants.products.map( (id) => { return id.handle.toUpperCase(); });
    let TuscIds = tuscCategAndCodes.map((categAndCode) => {return categAndCode.categProducts});
    TuscIds = TuscIds.flat();
    console.log(handles);
    for(idVariants of productHandleVariants.products) {
        if (!TuscIds.includes(idVariants.handle.toUpperCase())) {
            await postShopifyMod.deleteProds(idVariants.id, accessToken);
            console.log("product " + idVariants.handle + " deleted")
        }
    }
    for (id of TuscIds){
        let category = '';
        for (categAndCode of tuscCategAndCodes) {
            if (categAndCode.categProducts.includes(id)) {
                category = categAndCode.categoryName;
            }
        }//replace with filter??
        console.log(id);
        if (!handles.includes(id)){
            const newSkuEndpoints = await productsMod.getProductsCodesSkuEndPoints([id]);
            console.log(newSkuEndpoints[0]);
            const shopifyProduct = await skusMod.getSkuDetails(newSkuEndpoints[0], category);
                console.log("POSTING:");
                // console.log(shopifyProduct);
                const res = await postShopifyMod.postProds(shopifyProduct, accessToken);
                await putShopifyMod.putVariantImages(res, accessToken);
            console.log("product " + id + " added")
        }
    }
    

}
syncProducts('8f8fe618383fb36975c4ae278c6016ae');

// const deleteOptions = {
//     method: 'DELETE',
//     uri: 'https://tuscstore.myshopify.com/admin/api/2020-01/products/4713841262637.json',
//     json: true,
//     headers: {
//         'X-Shopify-Access-Token': '8f8fe618383fb36975c4ae278c6016ae', 
//         'content-type': 'application/json'
//     }
// };



// request.delete(deleteOptions)
// .then((res)=>{
//     console.log("deleted variant");
// })



const syncPriceQuantity = async (accessToken, param) => {
    console.log("syncPriceQuantity");
    const productVariants = await putShopifyMod.getVariantInfo(accessToken);
    const SkuDetails = await skusMod.requestUpdateSku(param);
    for (variants of productVariants.products) {
        for (variant of variants.variants) {
            if (param === "prices") {
                TuscPrices = SkuDetails.response;
                const found = TuscPrices.find(element => element.sku === variant.sku);
                const price = found.prices.list.default;
                if (price !== variant.price) {
                    console.log("price changed")
                    await putShopifyMod.putVariantInfo(accessToken, price);
                }
                console.log(variant.sku + "Tuscany price: " + price + "Shopify price: " + variant.price);
            } else if (param === "quantity") {
                TuscQuantity = SkuDetails.items;
                const quantity = TuscQuantity[variant.sku];
                if (quantity !== variant.inventory_quantity) {
                    console.log("quantity changed")
                    await putInventoryMod.putInventoryInfo(accessToken, variant.inventory_item_id, quantity);
                }
                console.log(variant.sku + "Tuscany quantity: " + quantity + " Shopify quantity: " + variant.inventory_quantity);
            }
        }
    }
}
// syncPriceQuantity('8f8fe618383fb36975c4ae278c6016ae',"prices");
// syncPriceQuantity('8f8fe618383fb36975c4ae278c6016ae',"quantity");



const runProject = async (accessToken) => {
    const categories = await categoriesMod.getCatergories();
    for (const category of categories) {
        if (category.products !== undefined) {
            const prodBodyAndSkuEndPoints = await productsMod.getProductsCodesSkuEndPoints(category.products);
            for (const varEndPoints of prodBodyAndSkuEndPoints) {
                const shopifyProduct = await skusMod.getSkuDetails(varEndPoints, category.name);
                console.log("POSTING:");
                // console.log(shopifyProduct);
                const res = await postShopifyMod.postProds(shopifyProduct, accessToken);
                await putShopifyMod.putVariantImages(res, accessToken);
            }
        }

    }
    const task1 = cron.schedule("0 0,6,15,20 * * *", syncPriceQuantity(accessToken,"prices"),{
        scheduled: false,
        timezone: "America/New_York"
    });
    const task2 = cron.schedule("0 * * * *", syncPriceQuantity(accessToken,"quantity"),{
        scheduled: false,
        timezone: "America/New_York"
    });
    task1.start();
    task2.start();
};


//runProject('abc');

module.exports = {
    runProject: runProject,
    syncPriceQuantity: syncPriceQuantity
}