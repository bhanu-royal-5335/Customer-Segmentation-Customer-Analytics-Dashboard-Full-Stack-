import mongoose from 'mongoose';

export let isMongoConnected = false;

export const connectDB = async (): Promise<boolean> => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/customer_segmentation_db';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000
    });
    isMongoConnected = true;
    console.log('MongoDB Atlas Connected Successfully!');
    return true;
  } catch (error: any) {
    isMongoConnected = false;
    console.warn(`MongoDB Connection Warning (${error.message}). Running in-memory mock mode.`);
    return false;
  }
};
