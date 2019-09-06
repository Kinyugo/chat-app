const expect = require("expect");
const { Users } = require("./Users");

describe("Users", () => {
  let users;

  beforeEach(() => {
    users = new Users([
      {
        id: 1,
        name: "mike",
        room: "Node Course"
      },
      {
        id: 2,
        name: "jen",
        room: "React Course"
      },
      {
        id: 3,
        name: "julie",
        room: "Node Course"
      }
    ]);
  });
  it("should add a new user", () => {
    const users = new Users();
    const user = {
      id: 123,
      name: "Andrew",
      room: "test-room"
    };

    const newUsers = users.addUser(user.id, user.name, user.room);

    expect(newUsers.users).toMatchObject([user]);
  });

  it("should return names for node course", () => {
    const nodeCourseUsers = users.getUsersFor("Node Course");
    expect(nodeCourseUsers).toMatchObject(["mike", "julie"]);
  });

  it("should return names for react course", () => {
    const nodeCourseUsers = users.getUsersFor("React Course");
    expect(nodeCourseUsers).toMatchObject(["jen"]);
  });

  it("should remove user", () => {
    const newUsers = users.removeUser(1);

    expect(newUsers.users.length).toBeLessThan(3);
  });

  it("should not remove users", () => {
    const newUsers = users.removeUser("gibber");

    expect(newUsers.users.length).toEqual(3);
  });

  it("should find user", () => {
      const user = users.getUser(1);
      
      expect(user).toMatchObject({id: 1, name: "mike", room: "Node Course"})
  })

  it("should not find user", () => {
      const user = users.getUser("gibber");

      expect(user).toBeFalsy()
  })
});
