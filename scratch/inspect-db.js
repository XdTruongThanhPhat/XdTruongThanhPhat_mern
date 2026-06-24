import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import Project from "../server/models/Project.js";

dotenv.config({ path: "../server/.env" });

async function run() {
  try {
    console.log("Connecting to MONGODB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected.");
    
    const projects = await Project.find({});
    console.log(`Found ${projects.length} projects:`);
    for (const p of projects) {
      console.log(`- Title: "${p.title}"`);
      console.log(`  ID: ${p._id}`);
      console.log(`  MainImage: ${p.mainImage ? "Yes" : "No"} (${p.mainImage})`);
      console.log(`  ProjectImages (length ${p.projectImages ? p.projectImages.length : 0}):`, p.projectImages);
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
