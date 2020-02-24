
                /** */
                /*POST PRODUCT START 
                var obj = {
                    "product":
                    {
                        "title": "Saturn",
                        "body_html": "<p>The epitome of elegance</p>",
                        "vendor": "Sabarish",
                        "product_type": "Planets",
                        "handle": "saturn",
                        "tags": "",
                        "images": [
                            {
                                "src": "https://solarsystem.nasa.gov/system/stellar_items/image_files/38_saturn_1600x900.jpg"
                            }
                        ]
                    }

                }
                const productRequestUrl = 'https://' + shop + '/admin/api/2020-01/products.json';
                let options = {
                    body: obj,
                    headers: {
                        "Content-type": "application/json",
                        'X-Shopify-Access-Token': accessToken
                    },
                    json: true // Automatically stringifies the body to JSON
                };
                request.post(productRequestUrl, options)
                    .then((shopResponse) => {
                        res.end(shopResponse);
                    })
                    .catch((error) => {
                        res.status(error.statusCode).send(error.error.error_description);
                    });

                POST PRODUCT END */










                //products.forEach((product) => {
                    //let productRequestUrl = requestUrl + `product-info?code=${product}`; //+product;
                    //console.log(productRequestUrl);
                    //  request.get(productRequestUrl, tuscanApiOptions)
                    //     .then((productResponse) => {
                    //         console.log(JSON.stringify(productResponse, null, 2));
                    //     })
                    //     .catch((error) => {
                    //         var respErr = JSON.parse(JSON.stringify(error.error));
                    //         console.log(respErr);
                    //     });
                // });


const requestUrl = "https://stage.tuscanyleather.it/api/v1/";
const categoryRequestUrl = requestUrl + 'categories';
let tuscanApiOptions = {
    uri: categoryRequestUrl,
    headers: {
        'Authorization': 'Bearer xxxxxxxx'
    },
    method: 'Get',
    json: true // Automatically stringifies the body to JSON
};

request(tuscanApiOptions)
    .then((categResponse) => {
        //res.end(categResponse);  
        categResponse.response.forEach((category) => {
            if (category.products !== undefined) {
                category.products.forEach((product) => {
                    let productApiOptions = {
                        uri: requestUrl + `product-info?code=${product}`,
                        headers: {
                            'Authorization': 'Bearer xxxxxx'
                        },
                        method: 'Get',
                        json: true 
                    };
                    request(productApiOptions)
                        .then((prodResponse) =>{
                            console.log(prodResponse); //Not returning all products
                        })

                })
            }

        })
    })
    .catch((error) => {
        console.log(error);
    });



    Promise.all(ps)
    .then((values) => {
        console.log(values);
  })
    .catch((err) =>{
        console.log(JSON.stringify(err,null,2));
    })
