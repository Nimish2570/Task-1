const mongoose = require("mongoose");
const mongoURI = "mongodb+srv://hitmanpubg96:pZ2vIy65Bi7Zev4U@nimishcluster.koavkqm.mongodb.net/";

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI, {
     
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
};

module.exports = connectToMongo;