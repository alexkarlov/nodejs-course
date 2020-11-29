const path = require("path");
const Logger = require(path.join(__dirname, "..", "logger")).createLogger();
const db = require(path.join(__dirname, "..", "models", "index"));

function getEventById(req, res) {
  db.eventModel
    .findByPk(parseInt(req.params.eventId), {
      include: [
        { model: db.userModel, as: "owner" },
        { model: db.userModel, as: "participants" },
      ],
    })
    .then((data) => {
      if (!data) {
        return res.status(200).send({
          status: 404,
          message: "No data found",
        });
      }
      res.status(200).send(data);
    })
    .catch(function (e) {
      console.log(e);
      res.status(500).send({
        message: "something went wrong",
        error: e,
      });
    });
}

function getEvents(req, res) {
  db.eventModel
    .findAll({
      include: [
        { model: db.userModel, as: "owner" },
        { model: db.userModel, as: "participants" },
      ],
    })
    .then((events) => {
      if (!events) {
        return res.status(200).send({
          status: 404,
          message: "No data found",
        });
      }
      res.status(200).send(events);
    })
    .catch(function (e) {
      res.status(500).send({
        message: "something went wrong",
        error: e,
      });
    });
}

function createEvent(req, res) {
  db.eventModel
    .create(req.body)
    .then((event) => {
      res.status(200).send(event);
    })
    .catch(function (e) {
      res.status(500).send({
        message: "something went wrong",
        error: e,
      });
    });
}

function updateEvent(req, res) {
  db.eventModel
    .update(req.body, {
      where: { id: req.params.eventId },
    })
    .then(() => {
      res.status(200).send("ok");
    })
    .catch(function (e) {
      res.status(500).send({
        message: "something went wrong",
        error: e,
      });
    });
}

function deleteEvent(req, res) {
  db.eventModel
    .destroy({
      where: { id: req.params.eventId },
    })
    .then(() => {
      res.status(200).send("ok");
    })
    .catch(function (e) {
      res.status(500).send({
        message: "something went wrong",
        error: e,
      });
    });
}

function createUser(req, res) {
  db.userModel
    .create(req.body)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(function (e) {
      res.status(500).send({
        message: "something went wrong",
        error: e,
      });
    });
}

async function deleteUser(req, res) {
  const tr = await db.sequelize.transaction();
  try {
    await db.eventModel.destroy({
      where: { ownerId: req.params.userId },
      transaction: tr,
    });
    await db.userModel.destroy({
      where: { id: req.params.userId },
      transaction: tr,
    });
    await tr.commit();
    res.status(200).send("ok");
  } catch (err) {
    await tr.rollback();
    res.status(500).send({
      message: "something went wrong",
      error: err,
    });
  }
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
  createUser: createUser,
  deleteUser: deleteUser,
  errorHandler: errorHandler,
};
