class Logger {
  log(...msg) {
    const extra = extractReq(msg);
    if (extra !== null) {
      msg[0] = extra;
    }
    console.log(...msg);
  }

  debug(...msg) {
    extra = extractReq(msg);
    if (extra !== null) {
      msg[0] = extra;
    }
    console.debug(msg);
  }

  error(...msg) {
    extra = extractReq(msg);
    if (extra !== null) {
      msg[0] = extra;
    }
    console.error(...msg);
  }

  warn(...msg) {
    extra = extractReq(msg);
    if (extra !== null) {
      msg[0] = extra;
    }
    console.warn(...msg);
  }
}

function extractReq(arg) {
  if (
    arg[0] &&
    Object.getPrototypeOf(arg[0]) instanceof require("http").IncomingMessage
  ) {
    let extra = {
      "http-method": arg[0].method,
      "http-url": arg[0].url,
    };
    if (arg[0].context && arg[0].context.traceID) {
      extra["trace-id"] = arg[0].context.traceID;
    }
    return extra;
  }
  return null;
}

function createLogger() {
  return new Logger();
}

module.exports = {
  createLogger: createLogger,
};
