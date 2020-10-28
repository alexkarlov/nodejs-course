class Logger {
    log(...msg) {
        console.log(...msg);
    }

    debug(...msg) {
        console.debug(vmsg);
    }

    error(...msg) {
        console.error(...msg);
    }

    warn(...msg) {
        console.warn(...msg);
    }
}

function createLogger() {
    return new Logger();
}

module.exports = {
    createLogger: createLogger
}