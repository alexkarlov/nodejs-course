const http = require('http');
const cp = require('child_process');
http.createServer((req, res) => {
  const start = new Date()
  console.log(`server got new request at ${start}`);
  const n = cp.fork(`${__dirname}/handler.js`, req);
  n.send({ numR: 1000 });
  n.on('message', (m) => {
    console.log(`the job has been finished by ${m.id}, request time:`, new Date() - start);
    res.end("ok")
  });
}).listen(8000, () => console.log("start listening on port 8000"));