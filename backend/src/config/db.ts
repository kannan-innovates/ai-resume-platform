import mongoose from "mongoose";

export const connectDB = async () => {
     try {
          await mongoose.connect(process.env.MONGO_URI as string);
          console.log('DATABASE CONNECTION SUCCESSFUL');
     } catch (error) {
          console.log('DATABASE CONNECTION FAILED', error);
          process.exit(1);
     }
}