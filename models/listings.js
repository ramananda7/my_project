const { ref } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listeningSchema = new Schema({
  title: {
    type: String,
    required: true, // Corrected property name
  },
  description: String,
  image: {
    filename: String,
    url:String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId, // Fixed capitalization
      ref: "Review",
    },
  ],
  Owner:{
    type : Schema.Types.ObjectId,ref :"User",
  }
});

const Listing = mongoose.model("Listing", listeningSchema);
module.exports = Listing;



