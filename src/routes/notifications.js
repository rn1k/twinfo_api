var express = require('express');
var router = express.Router();

var Twitter = require('twitter');
var client = new Twitter({
  consumer_key: 'h3f2tUgfvzcMGnEgZsOrIPqJq',
  consumer_secret: 'SaGznjLjrxCxs5guJDt840vB5R1iYLR97VRoEvyyQuR8HYPRG6',
  access_token_key: '75291310-KmrhTKmUE7NeR9edTQ2mHZs6NywfT3mh637nDuhtV',
  access_token_secret: 'zj4OW1SsBu4UkbtzeUAdYo2VQMsCQzKlmyvNl01rUxEHq'
});

var path = require("path");
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database( process.env["HOME"] + '/.twinfo/data.db');

function rows2notifs(rows){
  var notifs = {};
  for (var row of rows){
    id = row['trg_id'];
    user = {
        src_uid: row['src_uid'],
        time: row['event_time']
      };
    if ( id in notifs ){
      notifs[id]['users'].push(user);
    } else {
      notifs[id] = {
          text: row['twit'],
          time: row['post_time'],
          users: [user]
        };
    }
  }
  return notifs;
}

function rows2uids(rows){
  var uids = [];
  for (var row of rows){
    uid = row['src_uid'];
    uids.push(uid);
  }
  return uids;
}

router.get('/', function(req, res, next) {
  res.header('Content-Type', 'application/json; charset=utf-8')
  db.all('SELECT * FROM m1k', function(err, rows){
    if (!err) {
      var notifs = rows2notifs(rows);
      var uids = rows2uids(rows);
      // var options = { user_id: uids.slice(0, 10) };
      var options = { user_id: '560251114,909026307572326400' };
      client.get('/users/lookup', options, function(error, users, response){
        if (!error) {
          console.log(users);
        } else {
          console.log(error);
        }
      });
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
      var notifs = rows2notifs(rows);
      res.send(notifs);
    } else {
      res.send(err);
    }
  });
});

module.exports = router;

