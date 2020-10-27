const http = require('http');
const Logger = require('./logger.js').createLogger()
const Configs = require('./config.js').Configs

http.createServer((req, res) => {
    Logger.log('Hello world!');
    res.end();
}).listen(Configs.PORT, () => Logger.log(`Listening on port ${Configs.PORT} on ${Configs.ENV} env...`));
