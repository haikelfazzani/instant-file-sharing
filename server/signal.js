const Users = require('./Users');

let users = {};

module.exports = function signal(socket, io) {

  socket.emit('get-my-id', socket.id);

  socket.on("join-room", async ({ RoomId, username, initiator }) => {

    const usersInThisRoom = users[RoomId] || [];

    if (usersInThisRoom.length < 3) {
      socket.data.RoomId = RoomId;
      socket.data.username = username;
      socket.data.initiator = initiator;
      socket.data.id = socket.id;

      await socket.join(RoomId);
      Users.add(users, socket.data);

      socket.broadcast.to(RoomId)
        .emit("new-user-join-room", 'New user join room ' + username);
    }
  });

  socket.on("get-users-room", async RoomId => {
    if (users[RoomId] && users[RoomId].length > 0) {
      io.to(RoomId).emit("room-users", users[RoomId]);
    }
  });

  socket.on('signaling', ({ signal, to }) => {
    io.to(to)
      .emit("caller-signal", { signal, from: socket.id });
  });

  socket.on('receiver-signal', ({ signal, to }) => {
    io.to(to)
      .emit("on-receiver-signal", signal);
  });

  socket.on('file-status', ({ RoomId, message, username }) => {
    socket.broadcast.to(RoomId)
      .emit("file-status", { message, username });
  });

  socket.on('disconnect', () => {
    socket.data.id = socket.id;
    io.to(socket.data.RoomId).emit('leave-room', {
      message: socket.data.username + 'left room ',
      users: Users.remove(users, socket.data)
    });
  });
}