module.exports = {
    postRequestUrl: 'https://tuscstore.myshopify.com/admin/api/2020-01/products',//change shop name in production
    putRequestUrl: 'https://tuscstore.myshopify.com/admin/api/2020-01/variants/',//change shop name in production
    getShopifyUrl: 'https://tuscstore.myshopify.com/admin/api/2020-01/products.json?vendor=Tuscany%20Leather&fields=id,handle,variants',//change shop name in production
    putInventoryUrl: 'https://tuscstore.myshopify.com/admin/api/2020-01/inventory_levels/set.json'
  };
  //changed getShopifyUrl to include "id" in fields