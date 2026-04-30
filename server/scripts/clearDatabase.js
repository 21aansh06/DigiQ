import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/connectDB.js";

const clearDatabase = async () => {
  try {
    await connectDB();
    console.log("Connected to database");
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map((col) => col.name);

    console.log(`Found ${collectionNames.length} collections to clear`);
    for (const collectionName of collectionNames) {
      await mongoose.connection.db.collection(collectionName).drop();
      console.log(`✓ Dropped collection: ${collectionName}`);
    }

    console.log("\n✅ Database cleared successfully!");
    console.log("All collections have been removed.");
    
    await mongoose.connection.close();
    console.log("Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Error clearing database:", error);
    process.exit(1);
  }
};

clearDatabase();

