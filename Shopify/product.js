/**Add the Required NPM Modules */
const request = require('request-promise');

/* SHOPIFY's POST call */
const postProds = async (postApiOptions) => {
    await request.post(postApiOptions) 
   };