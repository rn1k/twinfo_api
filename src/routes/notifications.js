var express = require('express');
var router = express.Router();

var path = require("path");
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database( process.env["HOME"] + '/.twinfo/data.db');

function rows2notif(rows){
  var notifs = {};
  for (var row of rows){
    id = row['trg_id'];
    user = {
        'src_uid': row['src_uid'],
        'time': row['event_time']  
      };
    if ( id in notifs ){
      notifs[id]['users'].push(user);
    } else {
      notifs[id] = {
          'text': row['twit'],
          'time': row['post_time'],
          'users': [user]  
        };
    }
  }
  return notifs;
}

router.get('/', function(req, res, next) {
  res.header('Content-Type', 'application/json; charset=utf-8')
  db.all('SELECT * FROM m1k', function(err, rows){
    if (!err) {
      var notifs = rows2notif(rows);
      res.send(notifs);
    } else {
      res.send(err);
    }
  });
});

 
router.get('/:user', function(req, res, next) {

  res.header('Content-Type', 'application/json; charset=utf-8')

  db.all(`SELECT * FROM ${req.params.user}`, function(err, rows){
    if (!err) {
      var notifs = rows2notif(rows);
      res.send(notifs);
    } else {
      res.send(err);
    } 
  });
});

module.exports = router;
