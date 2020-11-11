const express = require("express");
const app = express();
const path = require("path");
const handlers = require(path.join(__dirname, "events", "handlers.js"));
app.use(express.json());
app.get("/events/:eventId", handlers.getEventById);
app.get("/events", handlers.getEvents);
app.post("/events", handlers.createEvent);
app.put("/events/:eventId", handlers.updateEvent);
app.delete("/events/:eventId", handlers.deleteEvent);
app.get("/events-batch", handlers.getEventsBatch);
app.listen(3000, function () {
  console.log("listening on 3000");
});
