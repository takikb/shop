
import express from "express";
import Mongoose from "mongoose";
import cors from "cors";
import { config } from "dotenv";
import { userRouter } from "../routes/users";
import { productRouter } from "../routes/products";

config();
const app = express();

app.use(express.json());
app.use(cors());

console.log(process.env.DB);

const DB = process.env.DB;  

const connectDB = async () => {
  await Mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
  })
  console.log("MongoDB Connected")
};
connectDB(); 

app.use("/auth", userRouter);
app.use("/", productRouter);

const PORT = process.env.PORT || 5000 ;

const server = app.listen(PORT, () => console.log("Server Started"));
// Handling Error
process.on("unhandledRejection", err => {
  console.log(`An error occurred: ${err.message}`)
  server.close(() => process.exit(1)) 
})