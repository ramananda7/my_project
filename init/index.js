const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listings.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await listing.deleteMany({});
  initData.data = initData.data.map((obj) =>({...obj,Owner:"67a10e88bd71dab1b6fdd93c"}));
  await listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();