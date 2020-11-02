function repeat(num) {
    for (let i = 0; i < num; i++) {
      for (let j = 0; j < num; j++) {
        console.log(`${i}.${j}`);
      }
    }
  }
  
  const start = new Date()
  repeat(100)
  setTimeout(() => console.log('Timeout:', new Date() - start), 0);
  process.nextTick(() => console.log('Next: ', new Date() - start));