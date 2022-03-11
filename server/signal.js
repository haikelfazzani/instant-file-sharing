const RoomDB = require("./utils/RoomDB");
const Users = require('./Users');

let users = {};
let validRooms = {};

module.exports = function signal(socket, io) {
  socket.emit('get-my-id', socket.id);

  socket.on("join-room", async ({ RoomId, username, initiator }) => {
    
    const usersInThisRoom = users[RoomId] || [];
    validRooms[RoomId] = RoomId;

    if (usersInThisRoom.length < 2) {
      socket.data.RoomId = RoomId;
      socket.data.username = username;
      socket.data.initiator = initiator;
      socket.data.id = socket.id;

      await socket.join(RoomId);
      Users.add(users, socket.data);

      socket.broadcast.to(RoomId).emit("new-user-join-room", {
        message:username + ' join room ',
        fullRoom:false
      });
    }
    else {  
      io.to(socket.id).emit("new-user-join-room", {fullRoom:false});
      socket.disconnect(true);
      io.in(socket.id).disconnectSockets(true);
    }
  });

  socket.on("get-users-room", async RoomId => {
    const roomUsers = users[RoomId];
    if (roomUsers && roomUsers.length > 0 && roomUsers.length < 3) {
      io.to(RoomId).emit("room-users", roomUsers);
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
    socket.data.id = socket.id;
    Users.remove(users, socket.data);
    const newUsers = await RoomDB.removeOne(socket.data.RoomId, socket.data);

    io.to(socket.data.RoomId).emit('leave-room', {
      message: socket.data.username + ' left room ',
      users: newUsers
    });
  });
}