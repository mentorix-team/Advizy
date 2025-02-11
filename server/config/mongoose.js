import mongoose from 'mongoose';

const runDropIndexes = async () => {
  try {
    // Replace with your MongoDB connection string
    const uri = "mongodb+srv://gurdev191004:xZ4JOIwab0NZaod6@cluster0.bwk8g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

    // Connect to MongoDB
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Drop all indexes for the "users" collection
    await mongoose.connection.db.collection("users").dropIndexes();

    console.log("Indexes dropped successfully for the 'users' collection");

    // Close the connection
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error dropping indexes:", error.message);
  }
};

// Run the function
runDropIndexes();
