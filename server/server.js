//'use strict';
const express = require("express");
const path = require("path");

const environments = require(path.join(__dirname, "..", "server/config/DB"));

let app = express();

app.use(express.static(path.join(__dirname, "..", "public/")));

const main = require("./routes/router");

app.use("/", main);

app.set("port", environments["port"] || process.env.PORT);
var server = app.listen(app.get("port"), function () {
	console.log("Express server has started on port : " + server.address().port);
});
