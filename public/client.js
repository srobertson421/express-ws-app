'use strict';

(function() {
  var socket;
  if(location.port) {
    socket = new WebSocket('ws://localhost:' + location.port);
  } else {
    socket = new WebSocket('ws://' + location.hostname);
  }
  var statusElem = document.getElementById('status');
  var usernameElem = document.getElementById('username');
  var messagesContainer = document.getElementById('messages');

  // Show a connected message when the WebSocket is opened.
  socket.onopen = function(event) {
    statusElem.innerHTML = 'Connected to: ' + event.currentTarget.url;
  };

  // Handle any errors that occur.
  socket.onerror = function(error) {
    statusElem.innerHTML = 'Error! ' + error;
    console.log('WebSocket Error: ' + error);
  };

  socket.onmessage = function(event) {
    var data = JSON.parse(event.data);

    messagesContainer.appendChild(createMessage(data.user, data.msg));
  }

  function createMessage(user, content) {
    var msgElem = document.createElement('li');
    msgElem.innerHTML = '<strong>' + user + '</strong>: ' + content;
    return msgElem;
  }

  document.getElementById('message-form').addEventListener('submit', function(event) {
    event.preventDefault();

    var data = {
      user: usernameElem.value,
      msg: event.currentTarget.msg.value
    }

    socket.send(JSON.stringify(data));
    messagesContainer.appendChild(createMessage(data.user, data.msg));
    event.currentTarget.msg.value = '';
  });
})()