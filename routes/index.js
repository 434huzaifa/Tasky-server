require('dotenv').config();
const express = require('express');
const router = express.Router();
const {isThisToken}=require("../middlewares/middlewares")
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express 2' });
});
router.post('/jsonwebtoken', async (req, res) => {
  const user = req.body
  const userid = await MyUser.findOne({ email: user.email })
  user.userid = userid._id
  const token = jwt.sign(user, process.env.TOKEN, { expiresIn: '1h' })
  res.cookie('mdhuzaifa', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
  }).send({ success: true })
})
router.post('/logout', isThisToken, async (req, res) => {
  res.clearCookie('mdhuzaifa', { maxAge: 0, sameSite: "none", secure: true, httpOnly: true }).send({ success: true })
})
module.exports = router;
