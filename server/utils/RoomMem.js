module.exports = class RoomMem {

  // add user to room
  static add(rooms, user) {
    const roomId = user.RoomId;
    if (rooms[roomId]) {
      const isFound = rooms[roomId].find(u => u.id === user.id || u.username === user.username);
      if (!isFound && rooms[roomId].length < 2) {
        rooms[roomId].push(user)
      }
      else {
        delete rooms[roomId];
      }
    }
    else {
      rooms[roomId] = [user]
    }
  }

  // remove user from room
  static remove(rooms, user) {
    try {
      let newUsers = rooms[user.RoomId] || [];
      if (rooms[user.RoomId]) {
        newUsers = rooms[user.RoomId].filter(u => u.id !== user.id || u.username !== user.username);
        rooms[user.RoomId] = newUsers;
      }
      return newUsers;
    } catch (error) {
      return [];
    }
  }

  // delete room by id
  static deleteRoom(rooms, roomId) {
    delete rooms[roomId];
    return [];
  }
}