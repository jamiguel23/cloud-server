'use strict';

const express = require('express');
const app = express();

const messages = [];

class Message {
  constructor(text, author) {
    this.text = text;
    this.author = author;
  }
}

app.get('/', (req, res) =>{
  res.status(200).send('home page hit!')
})

app.get('/message', (request, response) => {
  console.log('Someone sent a request: ' + request.method);

  response.send(messages);
});


function createMessage(req, res, next) {

  const messageText = req.query.text;
  const authorName = req.query.author;

  if (!messageText || !authorName) {
    next('No text or author');
  } else {
    const message = new Message(messageText, authorName);
  
    req.message = message;
    next();
  }
}

function saveMessage(req, res, next) {

  console.log('Data that was added to the request', req.message);
  let message = req.message;
  messages.push(message);
  next();
}



app.post('/message', createMessage, saveMessage, (request, response, next) => {
  
  response.send(messages);
});

app.use(function (err, request, response, next) {
  console.log(err);
  response.send('Error handler hit');
});


app.use(function (request, response) {
  response.status(404).send(' Nothing found ');
});

module.exports = {
  start: function (port) {
    app.listen(port, () => {
      console.log('App is running on : ' + port);
    });
  },
  app,
};
