
const request = require('request-promise');
const constants = require('./constants');

const putInventoryInfo = async(accessToken,item_id, quantity) => { //40457961517
    const locationId = getLocationId(accessToken);
    console.log("LocationID: "+locationId);
    const new_quantity = {
        "location_id": locationId, 
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



const getLocationId = async(accessToken) => {
    const getLocationOptions = {
        method: 'GET',
        uri: constants.getLocationUrl,
        json: true,
        headers: {
            'X-Shopify-Access-Token': accessToken, 
            'content-type': 'application/json'
        }
    };
    const location = await request(getLocationOptions);
    return location.locations[0].id;

}


module.exports = {
    putInventoryInfo
  };