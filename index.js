const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const authRoute = require('./routes/userRoute')
const shopRoute = require('./routes/shopRoute')
const mealRoute = require('./routes/mealRoute')


require("dotenv").config();

connectDB();

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: "GET,POST,PUT,DELETE",
    credentials: true, 
  })
);

app.use('/api/auth',authRoute)
app.use('/api/shop',shopRoute)
app.use('/api/meal',mealRoute)


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));