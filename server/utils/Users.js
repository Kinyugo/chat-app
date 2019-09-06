const { filter, compose, head, prop, map, curry } = require("ramda");

const matchId = curry((id, user) => prop("id", user) === id);
class Users {
  constructor(users = []) {
    this.users = users;
  }

  addUser(id, name, room) {
    return new Users(
      this.users.concat({
        id,
        name,
        room
      })
    );
  }

  getUsersFor(room) {
    const matchRoom = user => prop("room", user) === room;
    
    return compose(
      map(prop("name")),
      filter(matchRoom)
    )(this.users);
  }

  getUser(id) {
    return compose(
      head,
      filter(matchId(id))
    )(this.users);
  }

  removeUser(id) {
    const notMatchId = user => prop("id", user) !== id;
    return new Users(filter(notMatchId, this.users));
  }
}

module.exports = { Users };
