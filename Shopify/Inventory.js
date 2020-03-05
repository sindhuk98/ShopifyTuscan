
const request = require('request-promise');
const constants = require('./constants');

const putInventoryInfo = async(accessToken,item_id, quantity) => { //40457961517
    const new_quantity = {
        "location_id": 40457961517,
        "inventory_item_id": item_id,
        "available": quantity
      };
      const putOptions = {
        method: 'PUT',
        uri: constants.putInventoryUrl,
        json: true,
        headers: {
            'X-Shopify-Access-Token': accessToken, //hardcode for time-being************************
            'content-type': 'application/json'
        },
        body: new_quantity
    };
    await request(putOptions);

}

module.exports = {
    putInventoryInfo: putInventoryInfo
  };