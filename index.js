const productsMod = require('./Tuscan/products');
const categoriesMod = require('./Tuscan/categories');
const skusMod = require('./Tuscan/sku');
const productsShopifyMod = require('./Shopify/product');
const putShopifyMod = require('./Shopify/variantImages');
const putInventoryMod = require('./Shopify/Inventory');


const syncProducts = async (accessToken) => {
    console.log("inside syncProducts");

    /**Get Shopify Store Product id, Handle=ProductCodes and Variants ex: {products: [{id: 1234xxx, handle: TL1234, variants: [...]}],...]}*/
    const productHandleVariants = await productsShopifyMod.getProductFieldInfo(accessToken);

    /** Get handles(productCodes: ex: [TL141911,...]) from  productHandleVariants into an array*/
    const handles = productHandleVariants.products.map((id) => { return id.handle.toUpperCase(); });
    let shopifyIdSkus = productHandleVariants.products.map((product) => { 
        const prodSkus = product.variants.map((variant) => {return variant.sku});
        return {
            productId: product.id,
            productSkus: prodSkus
        }
    });

    /**Get the Category Name and Product Codes ex: [{categoryName: "Leather Bag", categoryProducts: [TL141911, TL14188,...]}, ...]*/
    const categNameAndProdCodes = await categoriesMod.getProductCodes();


    /** Get tuscanProdCodes(productIds: ex: [[TL141911,...], ...]) for each category from  productHandleVariants into a nested array  */
    let tuscanProdCodesUnfiltered = categNameAndProdCodes.map((categAndCode) => { return categAndCode.categProducts });

    /** Flattening tuscanProdCodes ex: [TL141911,...]*/
    tuscanProdCodesUnfiltered = tuscanProdCodesUnfiltered.flat();
    let tuscanProdCodes = [];
    let unsaleableSkuCodes = []; //unsaleable skus of saleable products
    let saleableSkuCodes = [];
    /** collect all saleable and unsaleable skus of Tuscany by looking at the "saleable" key for each sku */
    for (code of tuscanProdCodesUnfiltered) {
        const prodInfo = await productsMod.getProductsCodesSkuEndPoints(code);
        let unfilteredSkuFlag = true;
        let activeSkuOfProd = [];
        for(skuDetail of prodInfo.endpoints) {
            const sku = skuDetail.sku;
            const skuResponse = await skusMod.skuDetails(sku);
            if (skuResponse.response.saleable) {
                activeSkuOfProd.push(sku);
                if (!tuscanProdCodes.includes(code)){
                    tuscanProdCodes.push(code);
                }
            } else if(!skuResponse.response.saleable && (tuscanProdCodes.includes(code) || unfilteredSkuFlag)) {
                if(!unsaleableSkuCodes.includes(sku)){
                    unsaleableSkuCodes.push(sku);
                }
            }
            unfilteredSkuFlag = false;
        }
        if (activeSkuOfProd[0] !== undefined){
            const activeCodeSku = {
                product_code: code,
                activeSkus: activeSkuOfProd
            };
            saleableSkuCodes.push(activeCodeSku); 
        }       
    };
    // console.log(tuscanProdCodes);
    // console.log(handles);

    /** DELETING A PRODUCT */
    for (idVariants of productHandleVariants.products) { //replace for loop condition to handles?
        /**If Shopify Product does not exist in Tuscan Store Delete it from Shopify Store */
        if (!tuscanProdCodes.includes(idVariants.handle.toUpperCase())) {
            await productsShopifyMod.deleteProds(idVariants.id, accessToken);

            console.log("product " + idVariants.handle + " deleted")
        }
    }

    /** ADDING A PRODUCT */
    for (prodCode of tuscanProdCodes) {

        /**Get the CategoryName for the given ProdCode */
        let categoryName = '';
        for (categAndCode of categNameAndProdCodes) {
            if (categAndCode.categProducts.includes(prodCode)) {
                categoryName = categAndCode.categoryName;
            }
        }//replace with filter??

        /**If Tuscany Product does not exist in Shopify Store Add it to Shopify Store */
        if (!handles.includes(prodCode)) {

            const newSkuEndpoints = await productsMod.getProductsCodesSkuEndPoints(prodCode);
            const shopifyProduct = await skusMod.getShopifyProduct(newSkuEndpoints, categoryName);

            if (shopifyProduct !== undefined) {
                console.log("POSTING:");
                // console.log(shopifyProduct);
                const shopifyProdResponse = await productsShopifyMod.postProds(shopifyProduct, accessToken);
                putShopifyMod.putVariantImages(shopifyProdResponse, accessToken);
                console.log("product " + prodCode + " added")
            }
        }
    }

   /** DELETIONG AN INACTIVE VARIANT/SKU */
    for (product of shopifyIdSkus) {
        /**If Shopify Product does not exist in Tuscan Store Delete it from Shopify Store */
        for (shopifySku of product.productSkus){
            if (unsaleableSkuCodes.includes(shopifySku)) {
                await putShopifyMod.deleteVariant(product.productId, accessToken);
                console.log("sku " + shopifySku + " deleted")
            }
        } 
    }

    /** ADDING A NEW(ACTIVE) VARIANT/SKU */
    let shopifySkuCodes = shopifyIdSkus.map((idSku) => {return idSku.productSkus });
    shopifySkuCodes = shopifySkuCodes.flat();
    for (saleableProd of saleableSkuCodes) {
        for (activeSkuCode of saleableProd.activeSkus) {
            if (!shopifySkuCodes.includes(activeSkuCode)) {
                console.log("Shopify does not include activeSkuCode: " + activeSkuCode);
                const skuResponse = await skusMod.skuDetails(activeSkuCode);
                let new_variant = skusMod.createNewVariant(skuResponse, activeSkuCode);
                new_variant = {"variant": new_variant };
                const shopifyIdSkuObj = productHandleVariants.products.filter((idHandleVariants) => {
                    return idHandleVariants.handle.toUpperCase() === saleableProd.product_code;
                });
                console.log(shopifyIdSkuObj[0].id);
                const postVariantResponse = await putShopifyMod.postVariant(accessToken, shopifyIdSkuObj[0].id, new_variant);
                console.log("sku " + activeSkuCode + " added");
                const variantId = postVariantResponse.variant.id;
                console.log("variantId: " + variantId);
                
                /**Posting variant image */
                console.log(skuResponse.response.main_image.url);
                const imageObj = await skusMod.getImageData(skuResponse.response.main_image.url);
                const postImageToVariant = {
                    image: {
                        "variant_ids": [variantId],
                        "attachment": imageObj.attachment,
                        "filename": imageObj.filename
                    }
                }
                await putShopifyMod.postVariantImage(accessToken,shopifyIdSkuObj[0].id,postImageToVariant);
            }
        }
    }
    console.log("ended");
}
syncProducts('5476a5ad3e982a661cdad119bc775479');









/**takes parameters accessToken and param: "prices","quantity" */
const syncPriceQuantity = async (accessToken, param) => {
    console.log("syncPriceQuantity");

    /**productVariants has product id, handle, variants */
    const productVariants = await productsShopifyMod.getProductFieldInfo(accessToken);

    /** SkuDetails is a list of skus and param*/
    const skuDetails = await skusMod.skuUpdateDetails(param);


    for (variants of productVariants.products) {
        for (variant of variants.variants) {
            console.log(variant.sku);
            if (param === "prices") {
                const tuscSkusAndPrices = skuDetails.response;
                const updatedSkuPrice = tuscSkusAndPrices.find(skuAndPrice => skuAndPrice.sku === variant.sku);
                if (updatedSkuPrice !== undefined) {
                    const updatedPrice = updatedSkuPrice.prices.list.default;
                    if (updatedPrice !== variant.price) {
                        console.log("price changed")
                        await putShopifyMod.putVariantInfo(accessToken, updatedPrice);
                    }
                    console.log(variant.sku + "Tuscany price: " + updatedPrice + "Shopify price: " + variant.price);
                }

            } else if (param === "quantity") {
                const tuscSkuAndQuantity = skuDetails.items;
                const updatedQuantity = tuscSkuAndQuantity[variant.sku];
                if (updatedQuantity !== undefined && updatedQuantity !== variant.inventory_quantity) {
                    console.log("quantity changed" + variant.inventory_item_id + updatedQuantity);
                    await putInventoryMod.putInventoryInfo(accessToken, variant.inventory_item_id, updatedQuantity);
                }
                console.log(variant.sku + "Tuscany quantity: " + updatedQuantity + " Shopify quantity: " + variant.inventory_quantity);
            }
        }
    }
}
// syncPriceQuantity('5476a5ad3e982a661cdad119bc775479',"prices");
// syncPriceQuantity('5476a5ad3e982a661cdad119bc775479',"quantity");

module.exports = {
    syncProducts: syncProducts,
    syncPriceQuantity: syncPriceQuantity
}

//CANNOT INSTALL/RUN APP AT 12:00AM