const router = require('express').Router();
const { nanoid } = require('nanoid');
const jwt = require('jsonwebtoken');
const RoomDB = require("../utils/RoomDB");

router.get('/create', async (req, res) => {
  try {
    const { username, room } = req.query;

    if (username.length > 15 || room.length > 40) throw new Error('Invalid username or room uuid');

    const id = nanoid();
    const user = await RoomDB.getOne(room, username);
    const date = Date.now();

    if (user) {
      res.status(401).json({ success: false })
    }
    else {
      const token = jwt.sign({ username, room }, id, { expiresIn: 5 * 60 });
      await RoomDB.save(room, { username, id, date });
      res.send(token);
    }
  } catch (error) {
    res.status(401).send(null)
  }
});

router.get('/verify', async (req, res) => {
  try {
    const { token, username, room } = req.query;
    if (username.length > 15 || room.length > 40) throw new Error('Invalid username or room uuid');

    const user = await RoomDB.getOne(room, username);
    const success = jwt.verify(token, user.id);
    res.status(200).json({ success });
  } catch (error) {
    res.status(401).send(null)
  }
});

module.exports = router;
