require("dotenv").config();
const express = require("express");
const {ObjectId}=require("mongoose").Types
const router = express.Router();
const {
  isThisToken,
  emptyBodyChecker,
  checkBody,
  emptyQueryChecker,
  CheckQuery,
} = require("../middlewares/middlewares");
const { User, Task } = require("../Schemas/schemas");
const { erroResponse } = require("../Utility/Utility");
const jwt = require("jsonwebtoken");
router.get("/", function (req, res) {
  res.render("index", { title: "Express 2" });
});
router.post(
  "/user",
  emptyBodyChecker,
  checkBody(["name", "email"]),
  async (req, res) => {
    try {
      console.log(req.body);
      let user = await User.findOne({ email: req.body.email });
      if (!user) {
        user = new User(req.body);
        await user.save();
        res.status(201).send({ msg: "User Save" });
      } else {
        res.status(200).send({ msg: "User Found" });
      }
    } catch (error) {
      erroResponse(error);
    }
  }
);
router.get(
  "/user",
  emptyQueryChecker,
  CheckQuery(["mail"]),
  async (req, res) => {
    try {
      const user = await User.findOne({ email: req.query.mail });
      if (user) {
        res.status(200).send({ user: user });
      } else {
        res.status(400).send({ msg: "User not found" });
      }
    } catch (error) {
      erroResponse(error);
    }
  }
);
router.post(
  "/task",
  isThisToken,
  emptyBodyChecker,
  checkBody(["title", "description"]),
  async (req, res) => {
    try {
      console.log(req.body);
      const task = new Task(req.body);
      await task.save();
      res.status(201).send({ msg: "Task Created" });
    } catch (error) {
      erroResponse(res, error);
    }
  }
);
router.get(
  "/task",
  isThisToken,
  emptyQueryChecker,
  CheckQuery(["status", "page", "limit"]),
  async (req, res) => {
    try {
      const { page = 1, limit = 15 } = req.query;
      const options = {
        populate: { path: "createdBy", select: "name" },
        page: parseInt(page),
        limit: parseInt(limit),
      };
      const tasks= Task.paginate({user:new ObjectId(req.body.user),status:req.query.status},options)
      res.send(tasks)
    } catch (error) {
      erroResponse(res, error);
    }
  }
);
router.post(
  "/jsonwebtoken",
  emptyBodyChecker,
  checkBody(["email"]),
  async (req, res) => {
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        const token = jwt.sign({ id: user._id }, process.env.TOKEN, {
          expiresIn: "1h",
        });
        res
          .cookie("mdhuzaifa", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
          })
          .send({ success: true });
      } else {
        res.status(400).send({ msg: "Inavalid request" });
      }
    } catch (error) {
      erroResponse(res, error);
    }
  }
);
router.post("/logout", isThisToken, async (req, res) => {
  res
    .clearCookie("mdhuzaifa", {
      maxAge: 0,
      sameSite: "none",
      secure: true,
      httpOnly: true,
    })
    .send({ success: true });
});
module.exports = router;
