const http = require('http');
const handler = require('./handler.js')

http.createServer((req, res) => {
    handler(10).then( (val) => res.end(`result: ${val}`));
}).listen(8000, () => console.log("listening on port 8000"));
