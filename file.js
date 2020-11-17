const fs = require('fs');
const CsvReadableStream = require('csv-reader');
 
var inputStream = fs.createReadStream('events.csv', 'utf8');
 
inputStream
    .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
    .on('data', function (row) {
        console.log('A row arrived: ', row);
        inputStream.pause()
    })
    .on('end', function (data) {
        console.log('No more rows!');
    });