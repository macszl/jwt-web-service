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

db.roles.insertMany([{ name: "admin" }, { name: "user" }]);
