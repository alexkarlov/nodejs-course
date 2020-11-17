setTimeout(() => console.log('timeout1'));
setTimeout(() => {
   console.log('timeout2')
   Promise.resolve().then(() =>
console.log('promise resolve'))
});
setTimeout(() => console.log('timeout3'));
setTimeout(() => console.log('timeout4'));