const mongoose = require("mongoose");
require("dotenv").config();

//const connectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.p4km3.mongodb.net/Store`;
const connectionString = `mongodb+srv://dinozauras:PR5cGkv5497n-@cluster0.p4km3.mongodb.net/Store`;

async function main() {
  console.log("Connecting to database: " + connectionString);
  await mongoose.connect(connectionString);
  console.log("Connection to database was successful");
}

module.exports.connect = () => {
  main().catch((err) => console.log(err));
};
