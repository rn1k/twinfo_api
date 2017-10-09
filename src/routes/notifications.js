var express = require('express');
var router = express.Router();

var path = require("path");
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database( process.env["HOME"] + '/.twinfo/data.db');


router.get('/', function(req, res, next) {
  res.header('Content-Type', 'application/json; charset=utf-8')
  db.all("SELECT * FROM m1k", function(err, rows){
    if (!err) {
      res.send(rows);
    } else {
      res.send(err);
    }
  });
  db.close();
});

 
router.get('/:user', function(req, res, next) {

  res.header('Content-Type', 'application/json; charset=utf-8')

  db.all(`SELECT * FROM ${req.params.user}`, function(err, rows){
    if (!err) {
      res.send(rows);
    } else {
      res.send(err);
    } 
  });
});

module.exports = router;
