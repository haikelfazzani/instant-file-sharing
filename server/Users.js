module.exports = class Users {

  static add(users, user) {
    const roomId = user.RoomId;
    if (users[roomId]) {
      const isFound = users[roomId].find(u => u.id === user.id || u.username === user.username);
      if (!isFound && users[roomId].length < 2) {
        users[roomId].push(user)
      }
    }
    else {
      users[roomId] = [user]
    }
  }

  static remove(users, user) {
    let newUsers = users[user.RoomId] || [];
    if (users[user.RoomId]) {
      newUsers = users[user.RoomId]
        .filter(u => u.id !== user.id || u.username !== user.username);
      users[user.RoomId] = newUsers;
    }
    return newUsers;
  }
}