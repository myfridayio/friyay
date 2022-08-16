import fetch from "node-fetch";


let headers = {};

headers["Content-Type"] = "application/json";
headers["Authorization"] = "apikey saopedro::stepzen.net+1000::5c45e0f566f813a29c8d7846ed6b860bbec36a4eb91b1cabb42c681ddb25c685";
headers['Accept']= 'application/json';
headers['User-Agent'] = 'Node';

var graphql = JSON.stringify({
       query: `{getCustomerById(id: "-N6rOmxa7vOOTpZZSllL"){
        email
        name
    }
     }`,
});

var requestOptions = {
method: 'POST',
headers: headers,
body: graphql,
};


fetch("https://saopedro.stepzen.net/api/orange-bee/__graphql", requestOptions)
.then(response => response.text())
.then(result => console.log(result))
.catch(error => console.log('error', error));