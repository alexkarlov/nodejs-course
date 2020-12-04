const express = require("express");
const app = express();
const path = require("path");
const handlers = require(path.join(__dirname, "events", "handlers.js"));
const uuid = require("uuid");
const { AsyncLocalStorage } = require("async_hooks");
const storage = new AsyncLocalStorage();
const Logger = require("./logger").createLogger();
const WebSocketServer = require("websocket").server;
const fs = require("fs").promises;

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
app.use(express.static("public"));
app.use(handlers.errorHandler);
const server = app.listen(3000, function () {
  Logger.log("listening on 3000");
});
let connections = [];

wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});

wsServer.on("request", function (request) {
  const connection = request.accept();
  connections.push(connection);
  console.log(new Date() + " Connection accepted.");
  connection.on("message", async function (message) {
    if (message.type === "utf8") {
      console.log("Received Message: " + message.utf8Data);
      connections.forEach((conn) => {
        conn.send("new msg: " + message.utf8Data);
      });
    } else if (message.type === "binary") {
      console.log(
        "Received Binary Message of " + message.binaryData.length + " bytes"
      );
      try {
        const fname = uuid.v4();
        const fpath = path.join(__dirname, "public", "files", fname);
        const fURL = "http://localhost:3000/files/" + fname;
        await fs.writeFile(fpath, message.binaryData, "binary");
        // send path to the clients
        connections.forEach((conn) => {
          conn.send("file URL: " + fURL);
        });
        Logger.log(`file ${fpath} has been saved`);
      } catch (err) {
        console.log(err);
      }
    }
  });
  connection.on("close", function (reasonCode, description) {
    console.log(
      new Date() + " Peer " + connection.remoteAddress + " disconnected."
    );
  });
});
