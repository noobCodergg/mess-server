const MealModel = require("../models/mealModel");

exports.updateMealStatus = async (req, res) => {
  try {
    let { userId, date, mealType, status } = req.body;

    console.log(date)
    if (!userId || !date || !mealType || status === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Make sure userId is string
    if (typeof userId === "object") userId = userId.userId;

    // Start of day
    const mealDate = new Date(date);
    mealDate.setHours(0, 0, 0, 0);

    
    const existingMeal = await MealModel.findOne({
      userId,
      date
    });

    let meal;
    if (existingMeal) {
      existingMeal[mealType] = status;
      meal = await existingMeal.save();
    } else {
      meal = new MealModel({
        userId,
        date,
        noon: mealType === "noon" ? status : false,
        night: mealType === "night" ? status : false,
      });
      await meal.save();
    }

    res.status(200).json({
      message: "Meal status updated/created successfully",
      data: meal,
    });
  } catch (error) {
    console.error("Error updating meal status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};





exports.getMealStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    // Current month
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const startDate = new Date(year, month, 1);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(year, month + 1, 0);
    endDate.setHours(23, 59, 59, 999);

    // Fetch all meals for this user in the current month
    const meals = await MealModel.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 });

    // Format for frontend
    const formatted = meals.map((m) => ({
      date: m.date.getDate(),
      noon: m.noon,
      night: m.night,
    }));

    res.status(200).json({ data: formatted });
  } catch (error) {
    console.error("Error fetching meal status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




const User = require('../models/userModel')
const Shop = require("../models/shopModel");


exports.getCurrentMonthSummary = async (req, res) => {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-11

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

    // 1️⃣ Get all bazar entries for the month
    const bazarEntries = await Shop.find({ date: { $gte: startDate, $lte: endDate } });

    // Total bazar for all users
    let totalBazar = 0;
    const userBazarMap = {}; // { userId: totalBazar }

    bazarEntries.forEach((shop) => {
      let shopTotal = 0;
      shop.entries.forEach((item) => {
        shopTotal += item.price;
      });
      totalBazar += shopTotal;

      if (!userBazarMap[shop.userId]) userBazarMap[shop.userId] = 0;
      userBazarMap[shop.userId] += shopTotal;
    });

    // 2️⃣ Get all meal entries for the month
    const meals = await MealModel.find({ date: { $gte: startDate, $lte: endDate } });

    let totalMeal = 0;
    const userMealMap = {}; // { userId: totalMeal }

    meals.forEach((meal) => {
      const mealCount = (meal.noon ? 1 : 0) + (meal.night ? 1 : 0);
      totalMeal += mealCount;

      if (!userMealMap[meal.userId]) userMealMap[meal.userId] = 0;
      userMealMap[meal.userId] += mealCount;
    });

    // 3️⃣ Calculate meal rate
    const mealRate = totalMeal > 0 ? totalBazar / totalMeal : 0;

    // 4️⃣ Calculate per user data
    const users = await User.find({}); // all users
    const userSummaries = users.map((user) => {
      const userId = user._id.toString();
      const userTotalMeal = userMealMap[userId] || 0;
      const userTotalBazar = userBazarMap[userId] || 0;
      const userMealCost = userTotalMeal * mealRate;
      const remaining = userTotalBazar - userMealCost;

      return {
        userId,
        name: user.name,
        totalMeal: userTotalMeal,
        totalBazar: userTotalBazar,
        mealCost: userMealCost,
        remaining,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        totalBazar,
        totalMeal,
        mealRate,
        userSummaries,
      },
    });
  } catch (error) {
    console.error("Error getting monthly summary:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};





