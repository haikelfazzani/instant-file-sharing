const RoomDB = require("./utils/RoomDB");
const RoomMem = require('./utils/RoomMem');

let rooms = {};

module.exports = function signal(socket, io) {
  socket.emit('get-my-id', socket.id);

  socket.on("join-room", async ({ RoomId, username, initiator }) => {

    const usersInThisRoom = rooms[RoomId] || [];

    if (usersInThisRoom.length < 2) {
      socket.data.RoomId = RoomId;
      socket.data.username = username;
      socket.data.initiator = initiator;
      socket.data.id = socket.id;

      await socket.join(RoomId);
      RoomMem.add(rooms, socket.data);

      socket.broadcast.to(RoomId).emit("new-user-join-room", {
        message: username + ' join room ',
        fullRoom: false
      });
    }
    else {
      io.to(socket.id).emit("new-user-join-room", { fullRoom: false });
      socket.disconnect(true);
      io.in(socket.id).disconnectSockets(true);
      return;
    }
  });

  socket.on("get-users-room", async RoomId => {
    const usersInThisRoom = rooms[RoomId] || [];
    if (usersInThisRoom.length > 0 && usersInThisRoom.length < 3) {
      io.to(RoomId).emit("room-users", usersInThisRoom);
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

  socket.on('disconnect', async () => {
    // if one user left room , the room will be deleted
    io.to(socket.data.RoomId).emit('leave-room', {
      message: socket.data.username + ' left room ',
      users: RoomMem.deleteRoom(rooms, socket.data.RoomId)
    });

    await RoomDB.clean(socket.data.RoomId);
  });
}