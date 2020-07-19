import "./env";
import { resolve } from "path";
import express from "express";
import cors from "cors";
import { urlencoded, json } from "body-parser";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";

// import config from "./config/key";

const app = express();
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
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cookieParser());
app.use(helmet());
//=================================
//             static files
//=================================
app.use("/uploads", express.static("uploads"));
//=================================
//             API
//=================================
app.use("/api/users", require("./routes/users"));
//=================================
//             MVC
//=================================
app.use(require("./routes/globalRouter").default);
app.use(require("./routes/userRouter").default);
app.use(require("./routes/videoRouter").default);
app.use(require("./routes/testRouter").default);

//=================================
//             web server
//=================================
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(resolve(__dirname, "../client", "build", "index.html"));
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
