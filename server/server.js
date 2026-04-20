const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoute = require('./routes/auth');
const portfolioRoute = require('./routes/portfolio');
const watchlistRoute = require('./routes/watchlist');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoute);
app.use("/api/portfolio", portfolioRoute);
app.use("/api/watchlist", watchlistRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server is running on port 5000");
});