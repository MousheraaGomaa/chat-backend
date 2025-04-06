import express from 'express';
import'dotenv/config';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import connectToDB from './Database/database.js';
import generateSwaggerApiDoc from './swagger/swagger.js'
import cors from "cors";
// import crypto from 'crypto';

// console.log(crypto.randomBytes(64).toString('hex'))

//routes
import userRouter from './Routes/user.route.js';
import authRouter from './Routes/auth.route.js';
import messageRouter from './Routes/message.route.js';


const app = express();
const PORT = process.env.PORT || 5000;
// swagger

// Enable CORS
app.use(cors({
    origin: process.env.FRONT_URL || "http://localhost:4200", // Your frontend URL
    credentials: true,
}));

// bosy parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
// cookie
app.use(cookieParser());

//connect to database
connectToDB();
// swagger 
generateSwaggerApiDoc(app);

//routes
app.use(`/api/v1/users`, userRouter)
app.use(`/api/v1/users/auth`, authRouter );
app.use('/api/v1/message', messageRouter);


// global error handler
app.use((err,req,res,next)=>{
    res.status(500).json({message:err.message||'Something broke!'})
});
app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`)
});