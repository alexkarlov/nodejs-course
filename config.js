const Configs = {
    // default env
    ENV: 'local',
    // default port
    PORT: process.env.PORT
}
const args = {}
// parse args
process.argv.slice(2).forEach(arg =>{
    if (arg.slice(0,1) === '-') {
        const argPair = arg.split('=');
        const argName = argPair[0].slice(1,argPair[0].length);
        const argVal = argPair[1];
        args[argName] = argVal;
    }
})
// map args with exported configs
Object.entries(args).forEach(([key, value]) => {
    switch (key) {
        case 'env':
            Configs['ENV'] = value
            break;
        // other args might be here
    }
})

module.exports = {
    Configs: Configs
}
