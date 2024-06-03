const roomGenerator = require('../util/roomIdGenerator.js');

// Get the home page and list existing chatrooms
function getHome(req, res) {
  const db = req.app.get('db'); // Get the database instance from the app

  if (!db) {
      return res.status(500).send('Database not available.');
  }

  db.collection('messages').distinct('roomName', (err, chatrooms) => {
      if (err) throw err;
      res.render('home', { title: 'Home', chatrooms });
  });
}

// Create a new chatroom
function createRoom(req, res) {
  const roomName = req.body.roomName || roomGenerator.roomIdGenerator(); // Generate a new room ID if not provided
  const db = req.app.get('db'); // Get the database instance from the app

  // Create a new chatroom
  db.collection('messages').insertOne({ roomName }, (err, result) => {
    if (err) throw err;
    console.log('Chatroom created');
    res.redirect(`/${roomName}`); // Redirect to the new chatroom
  });
}

module.exports = {
  getHome,
  createRoom
};