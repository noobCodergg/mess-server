const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // string ID
  date: { type: Date, required: true },
  noon: { type: Boolean, default: false },
  night: { type: Boolean, default: false },
});



module.exports = mongoose.model("meals", mealSchema);
