const express = require("express");
const http = require("http");
const path = require('path');
const morgan = require('morgan');
const compression = require('compression');

const app = express();
const server = http.createServer(app);

app.disable('x-powered-by');
app.use(morgan('short'));
app.use(compression());

const isProduction = app.get('env') === 'production' || process.env.NODE_ENV === 'production';

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
      ? "*"
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

server.listen(5000, () => console.log('server is running on port 5000'));