const http = require('http');
const cp = require('child_process');
http.createServer((req, res) => {
  const start = new Date()
  console.log(`server got new request at ${start}`);
  const n = cp.fork(`${__dirname}/handler.js`, req);
  n.send({ num: 10 });
  n.on('message', (m) => {
    res.end(`result: ${m.res}`)
  });
}).listen(8000, () => console.log("start listening on port 8000"));