import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Db Connected");
  } catch (error) {
    console.log("Db connection Error", error);
  }
};

export default connectDb;
