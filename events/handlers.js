const path = require("path");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csv = require("csv-parser");
const fs = require("fs");
const converter = require("json-2-csv");
const lockFile = require("lockfile");
const Logger = require(path.join(__dirname, "..", "logger")).createLogger();

const filePath = path.join(__dirname, "events.csv");
const headerFile = [
  { id: "id", title: "id" },
  { id: "title", title: "title" },
  { id: "location", title: "location" },
  { id: "timestamp", title: "timestamp" },
];

function getEventById(req, res) {
  lockEvents(req, res, (req, res) => {
    let event;
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        // if we found one row no need to check others
        if (event) {
          return;
        }
        if (data.id == req.params.eventId) {
          event = data;
        }
      })
      .on("end", () => {
        if (!event) {
          res.status(404).send("event not found");
        } else {
          res.send(event);
        }
      })
      .on("error", (err) => {
        console.log("error while reading the file", err);
        res.status(500).send("internal error");
      });
  });
}

function getEvents(req, res) {
  lockEvents(req, res, (req, res) => {
    let results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        if (
          req.query.location === undefined ||
          req.query.location == data.location
        ) {
          results.push(data);
        }
      })
      .on("end", () => {
        res.send(results);
      })
      .on("error", (err) => {
        console.log("error while reading the file", err);
        res.status(500).send("internal error");
      });
  });
}

function createEvent(req, res) {
  lockEvents(req, res, (req, res) => {
    // just add at the end of the file
    fs.open(filePath, "a", 666, function (e, id) {
      // convert JSON array to CSV string
      converter.json2csv(
        req.body,
        (err, csv) => {
          if (err) {
            res.status(500).send();
            return;
          }
          const row = "\n" + csv;
          fs.write(id, row, null, "utf8", function () {
            fs.close(id, function () {
              res.status(200).send();
            });
          });
        },
        { prependHeader: false }
      );
    });
  });
}

function updateEvent(req, res) {
  lockEvents(req, res, (req, res) => {
    let results = [];
    let found = false;
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        if (data.id == req.params.eventId) {
          found = true;
          results.push(req.body);
        } else {
          results.push(data);
        }
      })
      .on("end", () => {
        if (found === false) {
          res.status(404).send("event not found");
          return;
        }
        const csvWriter = createCsvWriter({
          path: filePath,
          header: headerFile,
        });
        csvWriter.writeRecords(results).then(() => {
          res.status(200).send();
        });
      })
      .on("error", (err) => {
        console.log("error while reading the file", err);
        res.status(500).send("internal error");
      });
  });
}

function deleteEvent(req, res) {
  lockEvents(req, res, (req, res) => {
    let results = [];
    let found = false;
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        if (data.id == req.params.eventId) {
          found = true;
          return;
        }
        results.push(data);
      })
      .on("end", () => {
        if (found === false) {
          res.status(404).send("event not found");
          return;
        }
        const csvWriter = createCsvWriter({
          path: filePath,
          header: headerFile,
        });
        csvWriter.writeRecords(results).then(() => {
          console.log("The CSV file was written successfully");
          res.status(200).send();
        });
      })
      .on("error", (err) => {
        console.log("error while reading the file", err);
        res.status(500).send("internal error");
      });
  });
}

function getEventsBatch(req, res) {
  lockEvents(req, res, (req, res) => {
    let results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .pipe(res)
      .on("error", (err) => {
        console.log("error while reading the file", err);
        res.status(500).send("internal error");
      });
  });
}

function lockEvents(req, res, callback) {
  lockFile.lock("some-file.lock", { retryWait: 100, retries: 10 }, function (
    er
  ) {
    if (er) {
      console.error("error while locking file", er);
      res.status(500).send();
      return;
    }
    callback(req, res);
    lockFile.unlock("some-file.lock", function (er) {
      if (er) {
        console.error("error while unlocking file", er);
        res.status(500).send();
        return;
      }
    });
  });
}

function errorHandler(err, req, res, next) {
  Logger.error(err.stack);
  res.status(500).send("internal error");
}

module.exports = {
  getEventById: getEventById,
  getEvents: getEvents,
  createEvent: createEvent,
  updateEvent: updateEvent,
  deleteEvent: deleteEvent,
  getEventsBatch: getEventsBatch,
  errorHandler: errorHandler,
};
