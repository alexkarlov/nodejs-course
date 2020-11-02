const cluster = require('cluster');
const http = require('http');

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < 6; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  let counter = 0
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    counter++
    res.writeHead(200);
    console.log(`requests count ${counter} of worker ${process.pid}`)
    res.end(`hello world\nFrom ${process.pid}\n`);
  }).listen(8000);

  console.log(`Worker ${process.pid} started`);
}
