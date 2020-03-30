const syncQuantity = async (accessToken) => {
    console.log("syncQuantity");
    const productVariants = await putShopifyMod.getVariantInfo(accessToken);
    const SkuQuantity = await skusMod.requestUpdateSku("quantity");
    for (variants of productVariants.products) {
        for (variant of variants.variants) {
            TuscQuantity = SkuQuantity.items;
            const quantity = TuscQuantity[variant.sku];
            if (quantity !== variant.inventory_quantity){
                console.log("quantity changed")
                await putInventoryMod.putInventoryInfo(accessToken,variant.inventory_item_id,quantity);
            }
            console.log(variant.sku + "Tuscany quantity: " + quantity + " Shopify quantity: " + variant.inventory_quantity);
        }
    }

}
//syncQuantity('8f8fe618383fb36975c4ae278c6016ae');

const syncPrice = async (accessToken) => {
    console.log("syncPrice");
    const productVariants = await putShopifyMod.getVariantInfo(accessToken);
    const SkuPrices = await skusMod.requestUpdateSku("prices");
    for (variants of productVariants.products) {
        for (variant of variants.variants) {
            TuscPrices = SkuPrices.response;
            const found = TuscPrices.find(element => element.sku === variant.sku);
            const price = found.prices.list.default;
            if (price !== variant.price){
                console.log("price changed")
                await putShopifyMod.putVariantInfo(accessToken,price);
            }
            console.log(variant.sku + "Tuscany price: " + price + "Shopify price: " + variant.price);
        }
    }

}
 syncPrice('5476a5ad3e982a661cdad119bc775479');



    /** UPDATE SKUS */
    let skus = [];
    for (product of productHandleVariants.products){
        const productId = product.id;
        const variantSku = product.variants.map((variant)=>{return {"sku": variant.sku, "variantId": variant.id, "product_id": productId}});
        skus = skus.concat(variantSku);
    }
    console.log(skus);

    let tuscSkus=[];
    for (id of TuscIds){
        const product = await productsMod.getProductInfo(id);
        const itemSku = product.response.items.map((item)=>{return item.sku});
        // console.log(itemSku);
        tuscSkus = tuscSkus.concat(itemSku);
    }

    for(skuObj of skus) {
        if (!tuscSkus.includes(skuObj.sku)) {
            await putShopifyMod.deleteVariant(skuObj.variantId,accessToken);
            console.log("sku " + skuObj.sku + " deleted")
        }
    }
    for (tuscSku of tuscSkus){
        console.log("tuscSku: " + tuscSku);
        const skus1 = skus.filter(skuObj => skuObj.sku === tuscSku);
        console.log(skus1);
        if (skus1 === undefined){
            
            console.log("sku " + tuscSku + " added")
        }
    } 


/** OLD PROJECT RUN */
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
    const task1 = cron.schedule("0 0,6,15,20 * * *", syncPriceQuantity(accessToken, "prices"), {
        scheduled: false,
        timezone: "America/New_York"
    });
    const task2 = cron.schedule("0 * * * *", syncPriceQuantity(accessToken, "quantity"), {
        scheduled: false,
        timezone: "America/New_York"
    });
    task1.start();
    task2.start();
};
//runProject('abc');