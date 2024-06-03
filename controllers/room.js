const roomGenerator = require('../util/roomIdGenerator.js');

// Get a specific chatroom
function getRoom(req, res) {
  const roomName = req.params.roomName;
  const db = req.app.get('db'); // Get the database instance from the app

  // Retrieve messages for the chatroom
  db.collection('messages').find({ roomName }).toArray((err, messages) => {
    if (err) throw err;
    res.render('room', { title: 'Chatroom', roomName, messages, newRoomId: roomGenerator.roomIdGenerator() });
  });
}

// Get messages for a specific chatroom
function getMessages(req, res) {
  const roomName = req.params.roomName;
  const db = req.app.get('db'); // Get the database instance from the app

  db.collection('messages').find({ roomName }).toArray((err, messages) => {
    if (err) throw err;
    res.json(messages);
  });
}

// Store a new message
function postMessage(req, res) {
  const message = {
    roomName: req.body.roomName,
    nickname: req.body.nickname,
    text: req.body.text,
    timestamp: new Date()
  };

  const db = req.app.get('db'); // Get the database instance from the app

  db.collection('messages').insertOne(message, (err, result) => {
    if (err) throw err;
    console.log('Message inserted');
    res.sendStatus(200);
  });
}

module.exports = {
  getRoom,
  getMessages,
  postMessage
};