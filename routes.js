const http = require("http");
const path = require("path");

const paramsRegexp = /:[^/]+/g;
const getRouteRegexp = (route) =>
  new RegExp(`^${route}$`.replace(paramsRegexp, "([^/]+)"));

function getRouteParams(matchedRoute, path) {
  const paramsNames = (matchedRoute.match(paramsRegexp) || []).map((item) =>
    item.substring(1)
  );
  return paramsNames
    ? path
        .match(getRouteRegexp(matchedRoute))
        .slice(1)
        .reduce(
          (res, val, idx) => Object.assign(res, { [paramsNames[idx]]: val }),
          {}
        )
    : {};
}
const readBody = (req) => {
  return new Promise((resolve, reject) => {
    let bodyData = Buffer.from([]);
    req.on("data", (data) => (bodyData = Buffer.concat([bodyData, data])));
    req.on("end", () => resolve(JSON.parse(bodyData.toString())));
    req.on("error", reject);
  });
};

const routes = {
  GET: new Map([
    [
      "/events/:eventId",
      (req, res) => {
        res.end("req params", req.params);
      },
    ],
    [
      "/events",
      (req, res) => {
        res.end("req params", req.params);
      },
    ],
  ]),
  POST: new Map([
    [
      "/events",
      async (req, res) => {
        try {
          const body = await readBody(req);
          console.log("req body", body);
          res.end("ok");
        } catch (err) {
          console.log("error while reading body", err);
          res.end("something went wrong");
        }
      },
    ],
  ]),
};

http
  .createServer((req, res) => {
    try {
      const [path, queryParams] = req.url.split("?");
      const matchedRoutes = routes[req.method.toUpperCase()];

      const matchedRoute = [...matchedRoutes.keys()].find((route) => {
        return getRouteRegexp(route).test(path);
      });

      const params = getRouteParams(matchedRoute, path);
      Object.assign(req, { queryParams, params });
      matchedRoutes.get(matchedRoute)(req, res);
      console.log("why");
    } catch (err) {
      console.log("something went wrong", err);
    }
  })
  .listen(3000, () => console.log(`Listening on port 3000...`));
