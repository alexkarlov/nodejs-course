const express = require("express");
const app = express();
const path = require("path");
const handlers = require(path.join(__dirname, "events", "handlers.js"));
const uuid = require("uuid");
const { AsyncLocalStorage } = require("async_hooks");
const storage = new AsyncLocalStorage();
const Logger = require("./logger").createLogger();

const requestIdMiddleware = (req, res, next) => {
  storage.run(new Map([["requestId", uuid.v4()]]), () => {
    next();
  });
};

const auth = require(path.join(__dirname, "middlewares", "auth"));

app.use(requestIdMiddleware);
app.use(function (req, res, next) {
  ctx = {
    traceID: storage.getStore().get("requestId"),
  };
  req.context = ctx;
  Logger.log(req, "new request");
  next();
});
app.use(express.json());
app.get("/events/:eventId", auth, (req, res) => {
  const id = storage.getStore().get("requestId");
  Logger.log(`[${id}] request received`);
  handlers.getEventById(req, res);
});
app.get("/events", auth, handlers.getEvents);
app.post("/events", auth, handlers.createEvent);
app.put("/events/:eventId", auth, handlers.updateEvent);
app.delete("/events/:eventId", auth, handlers.deleteEvent);
app.post("/users", auth, handlers.createUser);
app.delete("/users/:userId", auth, handlers.deleteUser);
app.post("/login", handlers.login);
app.post("/refresh_token", handlers.refreshToken);
app.get("/check_access", auth, (req, res) => {
  res.status(200).send("ok");
});
app.use(handlers.errorHandler);
app.listen(3000, function () {
  Logger.log("listening on 3000");
});
