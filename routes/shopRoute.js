const express = require("express");
const { addShopEntry, getShopEntriesByMonth, getMonthlyTotals } = require("../controllers/shopController");



const router = express.Router();

router.post('/shop-entry',addShopEntry)
router.get('/get-record-by-user',getShopEntriesByMonth)
router.get('/get-records',getMonthlyTotals)


module.exports = router;