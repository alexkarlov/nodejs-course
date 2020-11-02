const http = require('http');
http.createServer((req, res) => {
  const start = new Date()
  console.log(`got new request at ${start}`);
  for (let i = 0; i < 100000; i++) {
    for (let j = 0; j < 100000; j++) {
    }
  }
  res.writeHead(200);
  res.end("hello world");
  console.log('request time:', new Date() - start);
}).listen(8000, () => console.log("start listening on port 8000"));