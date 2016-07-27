"use strict";
const express = require('express');
const mongodb = require('mongodb');
const validUrl = require('valid-url');

const shortenUrl = require('./shortenUrl');

const MongoClient = mongodb.MongoClient;
let db;
const mongolabUri = process.env.MONGODB_URI;
const app = express();
// let Heroku set the port
const port = process.env.PORT || 5000;


app.get('/new/*', (request, response) => {
  const shortUrl = shortenUrl();
  const originalUrl = request.params['0'];
  const dbEntry = { shortUrl, originalUrl };

  if (!validUrl.isHttpsUri(originalUrl) && !validUrl.isHttpUri(originalUrl)) {
    response.json({ error: "That isn't a valid internet tube" })
  } else {
    db.collection('urls').save(dbEntry, (error, result) => {
      if (result) {
        response.json({ originalUrl, shortUrl });
      } else {
        response.json({ error: "Failure to store the url in the database. Boourns."})
      }
    })
  }
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
