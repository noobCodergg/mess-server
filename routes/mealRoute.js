// routes/mealRoutes.js
const express = require("express");
const router = express.Router();
const { updateMealStatus, getMealStatus, getCurrentMonthSummary } = require("../controllers/mealController");

router.post("/update-meal", updateMealStatus);
router.get('/get-meals-by-user/:userId',getMealStatus)
router.get('/get-summery',getCurrentMonthSummary)

module.exports = router;
