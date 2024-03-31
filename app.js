const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dayjs=require("dayjs")
const mongoose = require('mongoose');
const cors = require('cors');
const indexRouter = require('./routes/index');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@timeforge.ob9twtj.mongodb.net/Tasky?retryWrites=true&w=majority`
mongoose.connect(uri)
const app = express();

app.use(logger(function (tokens,req,res) {
    return [
        dayjs().format("MMM DD hh:mm:ss A"),
        tokens.url(req, res),
        tokens.method(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'),
    ].join(" - ")
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
    origin: [
        'http://localhost:5173'
    ],
    credentials: true
}));
app.use('/', indexRouter);

module.exports = app;
