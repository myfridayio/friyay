let headers = {};

headers["Content-Type"] = "application/json";
headers["Authorization"] = "apikey saopedro::stepzen.net+1000::5c45e0f566f813a29c8d7846ed6b860bbec36a4eb91b1cabb42c681ddb25c685";
headers['Accept']= 'application/json';
headers['User-Agent'] = 'Node';

const encode = (str) => {
    return encodeURIComponent(str).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)
  }

const graphQL = {
    query: `{getHistoryById(id: "-N6rOvLXK2t39x-Bp0UP") { KanyeSpotify FollowsKanye JeenYuhs userId } }`,
}


var url ='https://saopedro.stepzen.net/api/orange-bee/__graphql?query=' + encode(graphQL.query);


var requestOptions = {
method: 'POST',
headers: headers,
body: JSON.stringify(graphQL),
};

console.log(url)
