const url = require("url");
const {
  Home,
  GetOrders,
  AddOrder,
  badRequest,
  EditOrder,
  ResetOrders,
  CancelOrder,
  logs
} = require("./handlers");
const userRepo = require("./models/user_repo");
const fs = require("fs");

module.exports = (req, res) => {
  console.log(`Request ${req.method} came from ${req.url}`);
  const user_repo = new userRepo();

  const urlObject = url.parse(req.url, true, false);
  req.urlObject = urlObject;

  switch (req.method) {
    case "GET":
      if (urlObject.path.startsWith("/getAllOrders")) {
        GetOrders(req, res, user_repo);
        break;
      } else if (urlObject.path.startsWith("/logs")) {
        logs(req, res, user_repo);
        break;
      } else if (urlObject.path === "/") {
        Home(res, fs);
        break;
      }
    case "POST":
      if (urlObject.path.startsWith("/addNewOrder")) {
        AddOrder(req, res, user_repo);
        break;
      }
    case "PUT":
      if (urlObject.path.startsWith("/editOrder")) {
        if (urlObject.query.id && urlObject.query.tickets) {
          EditOrder(req, res);
          break;
        }
      }
    case "DELETE":
      if (urlObject.path.startsWith("/resetAllOrders")) {
        ResetOrders(req, res, user_repo);
        break;
      } else if (urlObject.path.startsWith("/cancelOrder")) {
        CancelOrder(req, res);
        break;
      }
    default:
      badRequest(req, res);
  }
};
