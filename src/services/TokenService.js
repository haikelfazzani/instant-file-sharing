import axios from "axios";
import nanoid from "../utils/nanoid";
import makeid from "../utils/makeid";

const SERVER_URL = process.env.NODE_ENV === 'production'
  ? 'https://instant-sharing.onrender.com'
  : 'http://localhost:5000';

export default class TokenService {

  static async create() {
    try {
      const room = nanoid();
      const username = makeid(5);
      const friendUsername = makeid(5);
      const link = '/sharing?room=' + room + '&initiator=true';

      const token = await axios.get(SERVER_URL + '/token/create?room=' + room + '&username=' + username);
      const tokenFriend = await axios.get(SERVER_URL + '/token/create?room=' + room + '&username=' + friendUsername);

      return {
        url: link + '&username=' + username + '&token=' + token.data,
        shared: window.location.origin + link.replace('true', 'false') + '&username=' + friendUsername + '&token=' + tokenFriend.data
      }
    } catch (error) {
      return null;
    }
  }

  static async verify({ token, RoomId, username }) {
    try {
      return await axios.get(SERVER_URL + '/token/verify?token=' + token + '&room=' + RoomId + '&username=' + username)
    } catch (error) {
      return null;
    }
  }
}