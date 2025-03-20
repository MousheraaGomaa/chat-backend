import express from 'express';
import'dotenv/config';
import bodyParser from 'body-parser';
import connectToDB from './Database/database.js';
//routes
import authRouter from './Routes/auth.route.js';

const app = express();
const PORT = process.env.PORT || 5000;


// bosy parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//connect to database
connectToDB();

//routes
app.use(`/api/v1/users/auth`, authRouter )


// global error handler
app.use((err,req,res,next)=>{
    res.status(500).json({message:err.message||'Something broke!'})
});
app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`)
});