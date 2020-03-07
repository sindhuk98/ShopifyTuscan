
const request = require('request-promise');
const constants = require('./constants');

const putInventoryInfo = async(accessToken,item_id, quantity) => { //40457961517
    const new_quantity = {
        "location_id": 40457961517,  // Need to update Shangrilafashion location id
        "inventory_item_id": item_id,
        "available": quantity
      };
      const putOptions = {
        method: 'POST',
        uri: constants.putInventoryUrl,
        json: true,
        headers: {
            'X-Shopify-Access-Token': accessToken, 
            'content-type': 'application/json'
        },
        body: new_quantity
    };
    await request(putOptions);

}

module.exports = {
    putInventoryInfo: putInventoryInfo
  };