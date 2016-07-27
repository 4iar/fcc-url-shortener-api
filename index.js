"use strict";
const express = require('express');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let db;
const mongolabUri = process.env.MONGODB_URI;
const app = express();
// let Heroku set the port
const port = process.env.PORT || 5000;

app.get('/new/:originalUrl', (request, response) => {
  db.collection('test').save({originalUrl: request.params.longUrl, shortenedUrl: 'quckakadlkj'}, (error, result) => {
    console.log(result);
  })

  response.json({f: request.params.longUrl});
});

MongoClient.connect(mongolabUri, (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(port);
})
