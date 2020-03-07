const shop = 'tuscstore'; //change shop name in production

module.exports = {
  prodRequestUrl: 'https://' + shop + '.myshopify.com/admin/api/2020-01/products',
  variantRequestUrl: 'https://' + shop + '.myshopify.com/admin/api/2020-01/variants/',
  getProductFieldsUrl: 'https://' + shop + '.myshopify.com/admin/api/2020-01/products.json?vendor=Tuscany%20Leather&fields=id,handle,variants',
  putInventoryUrl: 'https://' + shop + '.myshopify.com/admin/api/2020-01/inventory_levels/set.json'
};