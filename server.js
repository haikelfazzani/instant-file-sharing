const express = require("express");
const http = require("http");
const path = require('path');
const morgan = require('morgan');
const compression = require('compression');
const jwt = require('jsonwebtoken');

const cors = require('cors');
const app = express();
const server = http.createServer(app);
const { nanoid } = require('nanoid')

app.disable('x-powered-by');
app.use(compression());

const isProduction = app.get('env') === 'production' || process.env.NODE_ENV === 'production';
isProduction ? '' : app.use(morgan('short'));
app.use(cors(isProduction ? "https://instant-sharing.onrender.com" : "http://localhost:3000"));

const RoomDB = require("./server/utils/RoomDB");

app.get('/token/create', async (req, res) => {
  try {
    const { username, room } = req.query;
    const id = nanoid();
    const user = await RoomDB.getOne(room, username);

    if (user) {
      res.status(401).json({ success: false })
    }
    else {
      const token = jwt.sign({ username, room }, id, { expiresIn: 60 * 60 });
      await RoomDB.save(room, { username, id });
      res.send(token);
    }
  } catch (error) {
    res.status(401).json({ success: false })
  }
});

app.get('/token/verify', async (req, res) => {
  try {
    const { token, username, room } = req.query;
    const user = await RoomDB.getOne(room, username);
    const success = jwt.verify(token, user.id);
    res.status(200).json({ success });
  } catch (error) {
    res.status(401).json({ success: false })
  }
})

if (isProduction) {
  app.use(express.static(path.join(__dirname, "build")));
  app.use(express.static("public"));

  app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });
}

const io = require('socket.io')(server, {
  cors: {
    origin: isProduction
      ? ["https://instant-sharing.onrender.com"]
      : ["http://localhost:3000"],
  },
  autoConnect: true,
  transports: ['websocket', 'polling'],
  credentials: false,
  allowEIO3: true
});

const signal = require('./server/signal');

io.on('connection', socket => {
  signal(socket, io);
});

const PORT = isProduction
  ? process.env.PORT
  : 5000;

server.listen(PORT, () => {
  console.log('server is running on port ' + PORT)
});