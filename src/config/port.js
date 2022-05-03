require("dotenv").config();

const port = process.env.LOCAL_PORT;
// process.env.NODE_ENV !== "production"
//   ? process.env.LOCAL_PORT
//   : process.env.PORT;

module.exports = { port };
