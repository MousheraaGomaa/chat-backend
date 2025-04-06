
import mongoose from  'mongoose';

const connectToDB = ()=>{
    mongoose.connect(process.env.MONGO_URI)
        .then(()=>{
            console.log('The database has been connected successfully!!!!');
        })
        .catch((err)=>{
            throw new Error(`Database connection failed:${err.message}`)
        })
}

export default connectToDB;
    