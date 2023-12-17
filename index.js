//to use this syntex add "type":"module" in package.json this is ES6 latest syntex.In this syntex make sure to write .js after file import
import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser';
import cors from 'cors';
import connectDB from './db/conn.js'
import userRoutes from './routes/userRoutes.js'
import testRoutes from './routes/testRoutes.js'
dotenv.config()

const app=express()
connectDB();
// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// app.use(express.json())
app.use("/api/v1/user",userRoutes)
app.use("/api/v1/test",testRoutes)

const PORT=process.env.PORT 
app.listen(PORT, () => {
    console.log(`Server is running on port number ${PORT}`);
  });