const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI)
const connection = mongoose.connection;
connection.on("error", console.error.bind("error in connecting to mongodb"));
connection.once("open", () => {
  console.log("successfully connected to mongodb");
});
module.exports = mongoose;
