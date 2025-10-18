const ShopModel = require("../models/shopModel");

exports.addShopEntry = async (req, res) => {
  try {
    const { userId, entries } = req.body;
    console.log(userId, entries);

    if (!userId || !entries || entries.length === 0) {
      return res.status(400).json({ message: "userId and entries are required" });
    }

    const saved = await ShopModel.create({ userId, entries });

    res.status(201).json({
      message: "Shop entry saved successfully",
      data: saved,
    });
  } catch (error) {
    console.error("Error saving shop entry:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};






exports.getShopEntriesByMonth = async (req, res) => {
  try {
    const { userId, month } = req.query; 
    console.log(userId, month)
    if (!userId || !month) {
      return res.status(400).json({ message: "userId and month are required" });
    }

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const monthIndex = monthNames.indexOf(month);
    if (monthIndex === -1) {
      return res.status(400).json({ message: "Invalid month name" });
    }

    
    const startDate = new Date(new Date().getFullYear(), monthIndex, 1);
    const endDate = new Date(new Date().getFullYear(), monthIndex + 1, 0, 23, 59, 59, 999);

    const entries = await ShopModel.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    });

    const totalPrice = entries.reduce((total, doc) => {
      return total + doc.entries.reduce((sum, item) => sum + item.price , 0);
    }, 0);

    res.status(200).json({ data: entries, totalPrice });
  } catch (error) {
    console.error("Error fetching shop entries:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




const userModel = require('../models/userModel')

exports.getMonthlyTotals = async (req, res) => {
  try {
    const now = new Date();
    const month = now.getMonth(); 
    const year = now.getFullYear();

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

    // Fetch all entries in current month
    const entries = await ShopModel.find({
      date: { $gte: startDate, $lte: endDate },
    });

    // Group by userId and calculate total
    const totalsMap = {};
    for (const doc of entries) {
      const userId = doc.userId;
      const totalForDoc = doc.entries.reduce(
        (sum, item) => sum + item.price ,
        0
      );

      if (!totalsMap[userId]) {
        totalsMap[userId] = totalForDoc;
      } else {
        totalsMap[userId] += totalForDoc;
      }
    }

    // Convert map to array with userName
    const result = [];
    for (const userId in totalsMap) {
      const user = await userModel.findById(userId);
      result.push({
        userId,
        userName: user ? user.name : "Unknown",
        total: totalsMap[userId],
      });
    }

    res.status(200).json({ data: result });
  } catch (error) {
    console.error("Error calculating monthly totals:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



