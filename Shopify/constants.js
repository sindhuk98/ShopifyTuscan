const shop = 'shangri-lafashion'; //change shop name in production
const vendor = 'Tuscany%20Leather';
const fields = 'id,handle,variants';

module.exports = {
  prodRequestUrl: 'https://' + shop + '.myshopify.com/admin/api/2020-01/products',
  variantRequestUrl: 'https://' + shop + '.myshopify.com/admin/api/2020-01/variants',
  getProductFieldsUrl: 'https://' + shop + '.myshopify.com/admin/api/2020-01/products.json?vendor='+vendor+'&fields='+fields,
  putInventoryUrl: 'https://' + shop + '.myshopify.com/admin/api/2020-01/inventory_levels/set.json',
  getLocationUrl: 'https://' + shop + '.myshopify.com/admin/api/2020-01/locations.json'
};