require("dotenv").config();

const express = require("express");
const cors = require("cors");
const authRoute = require("./routes/authRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoute);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost/${PORT}`);
});