import mongoose from "mongoose";

const uri = "mongodb+srv://gurdev191004:xZ4JOIwab0NZaod6@cluster0.bwk8g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Replace with your MongoDB connection string

const fixIndex = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    // Access the 'users' collection
    const collection = mongoose.connection.db.collection("users");

    // Drop the existing 'otptoken_1' index
    const indexes = await collection.indexes();
    if (indexes.some((index) => index.name === "otptoken_1")) {
      console.log("Dropping existing otptoken_1 index...");
      await collection.dropIndex("otptoken_1");
      console.log("Dropped otptoken_1 index successfully.");
    } else {
      console.log("No existing otptoken_1 index found.");
    }

    // Create a partial index for otptoken using $type to exclude null
    console.log("Creating partial index for otptoken...");
    await collection.createIndex(
      { otptoken: 1 },
      { unique: true, partialFilterExpression: { otptoken: { $type: "string" } } }
    );
    console.log("Partial index for otptoken created successfully.");

    // Close the connection
    await mongoose.connection.close();
    console.log("Connection closed.");
  } catch (error) {
    console.error("Error fixing the index:", error);
    process.exit(1);
  }
};

fixIndex();
