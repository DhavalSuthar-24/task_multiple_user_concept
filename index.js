import express from 'express'
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import authRoute from './routes/auth.route.js';
import userRoute from './routes/user.route.js';
import connectDB from './config/dbConnect.js';


const app = express()

connectDB();




dotenv.config();


app.use(express.json({limit:'5mb'}));
app.use(cookieParser());


app.use("/api/auth", authRoute);
app.use("/api/user",userRoute)
app.listen(7000, () => {
  console.log('Example app listening on port 7000!')
})