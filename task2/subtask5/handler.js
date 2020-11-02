process.on('message', (m) => {
    console.log(`CHILD ${process.pid} got req`);
    res = fibonacci_series(m.num)
    process.send({res: res});
});

function fibonacci_series(n) 
{
  if (n===1) 
  {
    return [0, 1];
  } 
  else 
  {
    var s = fibonacci_series(n - 1);
    s.push(s[s.length - 1] + s[s.length - 2]);
    return s;
  }
};