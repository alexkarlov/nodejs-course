process.on('message', (numR) => {
    console.log(`CHILD ${process.pid} got req`);
    for (let i = 0; i < numR; i++) {
        for (let j = 0; j < numR; j++) {
        }
    }
    process.send({id: process.pid});
});