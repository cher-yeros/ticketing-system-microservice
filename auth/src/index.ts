import express from "express";
import { json } from "body-parser";
import mongoose from "mongoose";

const app = express();

app.use(json());

app.listen(5000, () => {
  start();
  console.log("listening on http://localhost:5000");
});

const start = async () => {
  const url = "mongodb://auth-mongo-srv:27017/auth";

  try {
    await mongoose.connect(url);

    console.log("Connected to Mongo DB");
  } catch (error) {
    console.log(error);
  }
};
