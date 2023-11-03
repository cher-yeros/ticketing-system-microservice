import mongoose from "mongoose";

const uri =
  "mongodb+srv://yerosendiriba1:Matrix123456@cluster0.5srf2lx.mongodb.net/ms_auth";

const connectDatabase = async () => {
  const con: typeof mongoose = await mongoose.connect(uri);

  console.log(`📁  DB Connected`);

  return con;
};

export default connectDatabase;
