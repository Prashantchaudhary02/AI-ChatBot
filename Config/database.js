import  mongoose from "mongoose"

const connectDB = async()=>{

    mongoose.connect(process.env.MONGO);
}

export default connectDB;