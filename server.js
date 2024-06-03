const express = require('express');
const cookieParser = require('cookie-parser');
const hbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose'); // Import mongoose

const homeHandler = require('./controllers/home.js');
const roomHandler = require('./controllers/room.js');

const app = express();
const port = 8080;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.6', {})
.then(() => {
    console.log('MongoDB connected...');
    app.set('db', mongoose.connection);  // Make sure this line is within the 'then' block
})
.catch(err => console.log(err));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.get('/', homeHandler.getHome);
app.get('/create', homeHandler.createRoom); // Add route to create a new room
app.get('/:roomName', roomHandler.getRoom);
app.post('/:roomName/messages', roomHandler.postMessage); // Add route to post a new message
app.get('/:roomName/messages', roomHandler.getMessages); // Add route to get messages for a room

app.listen(port, function() {
  console.log('Server is running on port 8080');
});
