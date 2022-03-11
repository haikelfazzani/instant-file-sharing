const { writeFilePromise, readFilePromise } = require('./xtrafs');
const MAX_ITEMS = 2;

const file_path = process.cwd() + '/server/utils/.rooms.json';

module.exports = class JsonDb {

  static async save(room, user) {
    const all_rooms = await readFilePromise(file_path);

    if (!all_rooms) writeFilePromise(file_path, {});

    if (all_rooms[room]) {
      const isFound = all_rooms[room].find(u => u.username === user.username);

      if (!isFound && all_rooms[room].length < 3) {
        all_rooms[room].push(user);
        await writeFilePromise(file_path, all_rooms);
      }
      else {
        throw new Error('User already exists')
      }
    }
    else {
      all_rooms[room] = [user];
      await writeFilePromise(file_path, all_rooms);
    }
  }

  static async getOne(room, username) {
    try {
      const result = await readFilePromise(file_path);
      return result[room].find(u => u.username === username);
    } catch (error) {
      return null;
    }
  }

  static async removeOne(room, user) {
    try {
      const all_rooms = await readFilePromise(file_path);
      const newUsers = all_rooms[room].filter(u => u.username !== user.username);

      if (!newUsers) delete all_rooms[user.id]
      if (newUsers.length < 2) delete all_rooms[room];
      else {
        all_rooms[room] = newUsers;
      }
      await writeFilePromise(file_path, all_rooms);
      return newUsers;
    } catch (error) {
      return null;
    }
  }
}