require("dotenv").config();
const jwt = require("jsonwebtoken");

const isThisToken = async (req, res, next) => {
  const token = req?.cookies?.mdhuzaifa;
  console.log("~ token", token)
  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  jwt.verify(token, process.env.TOKEN, (error, decoded) => {
    if (error) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    req.body.user = decoded.id;
    next();
  });
};
/**
 * Check req.body empty or not
 * @returns 400 if empty otherwise next()
 */
function emptyBodyChecker(req, res, next) {
  if (req.method == "POST") {
    if (Object.keys(req.body).length == 0) {
      res.status(400).send({ msg: "Empty Body" });
      return;
    }
  }
  next();
}
/**
 * Check req.query empty or not
 * @returns 400 if empty otherwise next()
 */
function emptyQueryChecker(req, res, next) {
  if (Object.keys(req.query).length == 0) {
    res.status(400).send({ msg: "Empty Query" });
    return;
  }

  next();
}
/**
 *check required keys from frontend.
 *
 * @param {Array} expectedkeys - keys of data
 * @returns 404 if keys does not match. otherwise execute next()
 */
function checkBody(expectedkeys) {
  return (req, res, next) => {
    if (req.method == "POST") {
      let notfound = new Array();
      let keys = Object.keys(req.body);
      if (expectedkeys.length <= keys.length) {
        expectedkeys.forEach((key) => {
          let isInside = keys.includes(key);
          if (!isInside) {
            notfound.push(key);
          }
        });
        if (notfound.length != 0) {
          res.status(400).send({ msg: ` ${notfound.join(",")} notfound.` });
          return;
        }
      } else {
        console.log(req.body);
        res.status(400).send({ msg: "expectation failed." });
        return;
      }
    }
    next();
  };
}
/**
 *check required query parameter.
 *
 * @param {Array} expectedkeys - keys of data
 * @returns 400 if keys does not match. otherwise execute next()
 */
function CheckQuery(expectedkeys) {
  return (req, res, next) => {
    if (req.method == "GET") {
      let notfound = new Array();
      let keys = Object.keys(req.query);
      if (expectedkeys.length <= keys.length) {
        expectedkeys.forEach((key) => {
          let isInside = keys.includes(key);
          if (!isInside) {
            notfound.push(key);
          }
        });
        if (notfound.length != 0) {
          res.status(400).send({ msg: ` ${notfound.join(",")} notfound.` });
          return;
        }
      } else {
        console.log(req.body);
        res.status(400).send({ msg: "expectation failed." });
        return;
      }
    }
    next();
  };
}
module.exports = {
  isThisToken,
  emptyBodyChecker,
  emptyQueryChecker,
  checkBody,
  CheckQuery,
};
