//STEP1 1: Remove slice in categories.js

const prodUrl = 'https://www.tuscanyleather.it/api/v1/';

module.exports = {
    requestUrl: prodUrl,
    skuRequestUrl: prodUrl + 'item-info?sku=',
    authorization: {
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjE2NjY2OCwiaXNzIjoiaHR0cHM6Ly93d3cudHVzY2FueWxlYXRoZXIuaXQvcmVmcmVzaC1hcGktdG9rZW4iLCJpYXQiOjE1ODMxMTU0NTAsImV4cCI6MTg5ODQ3NTQ1MCwibmJmIjoxNTgzMTE1NDUwLCJqdGkiOiJUUDlHUE1NUUhPUDNoM2JXIn0.fAurowYbeHAWUvWRTeazFOMgZc4NOdlS9yexIkcgrmg'
    }
  };
