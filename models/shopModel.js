const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  entries: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  date: { type: Date, default: () => new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" })) },
});

module.exports = mongoose.model("shop", shopSchema);
