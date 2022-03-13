const { writeFilePromise, readFilePromise } = require('./xtrafs');
const file_path = process.cwd() + '/server/utils/.rooms.json';
const MAX_USERS_PER_ROOM = 3;

module.exports = class JsonDb {
  static async save(room, user) {
    const all_rooms = await readFilePromise(file_path);

    if (all_rooms && all_rooms[room]) {
      const isFound = all_rooms[room].find(u => u.username === user.username);

      if (!isFound && all_rooms[room].length < MAX_USERS_PER_ROOM) {
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
      if (result[room]) return result[room].find(u => u.username === username);
      else return null;
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

      await this.clean();
      return newUsers;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async clean(room) {
    try {
      // remove room
      if (room) { delete all_rooms[room]; return; }

      // check expiration room : 30 minutes
      const all_rooms = await readFilePromise(file_path);

      for (const [key, value] of Object.entries(all_rooms)) {
        if ((Date.now() > value[0].date + (30 * 60000)) || value.length < 2) {
          delete all_rooms[key];
        }
      }

      await writeFilePromise(file_path, all_rooms);
    } catch (error) {

    }
  }
} 