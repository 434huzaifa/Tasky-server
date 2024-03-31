require("dotenv").config();
const express = require("express");
const router = express.Router();
const {
  isThisToken,
  emptyBodyChecker,
  checkBody,
  emptyQueryChecker,
  CheckQuery,
} = require("../middlewares/middlewares");
const { User } = require("../Schemas/schemas");
const { erroResponse } = require("../Utility/Utility");

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
        res.status(200).send({ msg: "User Save" });
      } else {
        res.status(201).send({ msg: "User Found" });
      }
    } catch (error) {
      erroResponse(error);
    }
  }
);
router.get("/user",emptyQueryChecker,CheckQuery(["mail"]),async(req,res)=>{
  try {
    const user = await User.findOne({ email: req.query.mail });
    if (user) {
      res.status(200).send({user:user})
    }else{
      res.status(400).send({msg:"User not found"})
    }
  } catch (error) {
    erroResponse(error)
  }
})
router.post("/jsonwebtoken", async (req, res) => {
  const user = req.body;
  const userid = await User.findOne({ email: user.email });
  user.userid = userid._id;
  const token = jwt.sign(user, process.env.TOKEN, { expiresIn: "1h" });
  res
    .cookie("mdhuzaifa", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .send({ success: true });
});
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
