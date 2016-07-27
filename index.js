"use strict";
const express = require('express');
const mongodb = require('mongodb');
const shortenUrl = require('./shortenUrl');

const MongoClient = mongodb.MongoClient;
let db;
const mongolabUri = process.env.MONGODB_URI;
const app = express();
// let Heroku set the port
const port = process.env.PORT || 5000;


app.get('/new/:originalUrl', (request, response) => {
  const shortUrl = shortenUrl();
  const originalUrl = request.params.originalUrl;
  const dbEntry = { shortUrl, originalUrl };
  
  db.collection('urls').save(dbEntry, (error, result) => {
    console.log(result);
  })

  response.json({ originalUrl, shortUrl });
});

app.get('/:shortUrl', (request, response) => {
  const shortUrl = request.params.shortUrl;

  db.collection('urls').find({shortUrl: shortUrl}).limit(1).toArray((error, results) => {
    if (results.length) {
      response.redirect(results[0].originalUrl);
    } else {
      response.json({error: "You just made that up!"});
    }
  })
})

MongoClient.connect(mongolabUri, (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(port);
})
