const express = require("express");
const http = require("http");
const path = require('path');
const morgan = require('morgan');
const compression = require('compression');

const app = express();
const server = http.createServer(app);

app.disable('x-powered-by');
app.use(compression());

const isProduction = app.get('env') === 'production' || process.env.NODE_ENV === 'production';
isProduction ? '' : app.use(morgan('short'));

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