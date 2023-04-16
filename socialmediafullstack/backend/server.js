const app = require("./app");
const mongoose = require("./config/database");
const cloudinary = require('cloudinary')

cloudinary.config({
  cloud_name : process.env.CLOUDINARY_NAME,
  api_key : process.env.CLOUDINARY_KEY,
  api_secret : process.env.CLOUDINARY_SECRET
});

app.listen(process.env.PORT, () => {
  console.log(`server successfully running on the port ${process.env.PORT}`);
});
