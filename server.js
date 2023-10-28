const express = require("express");
const connectDb = require("./config/dbCOnnect");
const errorHandler = require("./middleware/errorhandler");
const dotenv = require("dotenv").config();
const app = express();
connectDb();
const port = process.env.PORT || 3000;
app.use(express.json()); //body parser to parse the stream of data being sent from client

app.use("/api/contacts", require("./routes/contactRoutes")); //middleware
app.use("/api/user", require("./routes/userRoutes"));

app.use(errorHandler);

app.listen(port, () => {
  console.log("Server running on port", port);
});
