require("./env");
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const morgan = require("morgan");
const helmet = require("helmet");

//=================================
//             mongoose
//=================================

// const mongoose = require("mongoose");
// const connect = mongoose.connect(config.mongoURI,
//   {
//     useNewUrlParser: true, useUnifiedTopology: true,
//     useCreateIndex: true, useFindAndModify: false
//   })
//   .then(() => console.log('MongoDB Connected...'))
//   .catch(err => console.log(err));

//=================================
//             middlewares
//=================================

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());

app.use("/api/users", require("./routes/users"));
app.use("/test", require("./routes/test"));
app.use("/uploads", express.static("uploads"));
//=================================
//             web server
//=================================
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

//=================================
//             error endpoint
//=================================

// 404 Not Found
app.use((req, res, next) => {
  res.status(404).send("NOT FOUND");
});

// 500 Server Error
app.use((err, req, res) => {
  console.log("Server Error: ", err);
  res.status(500).send("Server Error");
});
//=================================
//             server start
//=================================

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`✔ Server Listening on http://localhost:${port}`);
});
