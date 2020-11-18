const express = require("express");
const app = express();
const path = require("path");
const handlers = require(path.join(__dirname, "events", "handlers.js"));
const uuid = require("uuid");
const { AsyncLocalStorage } = require("async_hooks");
const storage = new AsyncLocalStorage();
const Logger = require("./logger").createLogger();
app.use(function (req, res, next) {
  ctx = {
    traceID: uuid.v4(),
  };
  req.context = ctx;
  Logger.log(req, "new request");
  next();
});
app.use(express.json());
app.get("/events/:eventId", (req, res) => {
  // i don't think this is a good solution to pass storage as an additional parameter, but...
  handlers.getEventById(req, res, storage);
});
app.get("/events", handlers.getEvents);
app.post("/events", handlers.createEvent);
app.put("/events/:eventId", handlers.updateEvent);
app.delete("/events/:eventId", handlers.deleteEvent);
app.get("/events-batch", handlers.getEventsBatch);
app.use(handlers.errorHandler);
storage.run(
  {
    traceID: uuid.v4(),
  },
  async () =>
    app.listen(3000, function () {
      console.log("listening on 3000");
    })
);
