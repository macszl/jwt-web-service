if (
  db.getCollectionNames().indexOf("users") >= 0 ||
  db.getCollectionNames().indexOf("roles") >= 0 ||
  db.getCollectionNames().indexOf("user_roles") >= 0
) {
  print("One or more collections already exist. Exiting program.");
  quit();
}

db.createCollection("users");
db.createCollection("roles");
db.createCollection("user_roles");

db.users.insertMany([
  {
    name: "user1",
    email: "user1@example.com",
    password: db.createHashedPassword("password1"),
  },
  {
    name: "user2",
    email: "user2@example.com",
    password: db.createHashedPassword("password2"),
  },
  {
    name: "user3",
    email: "user3@example.com",
    password: db.createHashedPassword("password3"),
  },
]);

db.roles.insertMany([{ name: "admin" }, { name: "user" }]);

db.user_roles.insertMany([
  { user: "user1", role: "admin" },
  { user: "user2", role: "user" },
  { user: "user3", role: "user" },
]);
