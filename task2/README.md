examples contains code from presentation
subtask0 - code that may behave differently on different runs
subtask1 - write server with api that blocks loop (and prove it)
subtask2 - same api non-blocking
subtask3 - create cluster with 6 workers. Run small server with some api. Run script that performs 100 calls to this server. Calculate on server how many requests handled each worker.
subtask4 - calculate n-th Fibonacci number on worker thread (can be as api)
subtask5 - calculate n-th Fibonacci number on child process (can be as api)

NOTES

1. The task with UV_THREADPOOL_SIZE shows weird results. If I use default size (4), I get next results:
```
okarlov@odl1912004:~/work/nodejs-course$ node task2/examples/slide29_threadpool_size.js 
Hash:  943
Hash:  952
Hash:  952
Hash:  952
Hash:  1538
```
If I change it to 5 I get unexpected slow results for last two hashes:
```
okarlov@odl1912004:~/work/nodejs-course$ node task2/examples/slide29_threadpool_size.js 
Hash:  949
Hash:  956
Hash:  956
Hash:  1328
Hash:  1330
```
