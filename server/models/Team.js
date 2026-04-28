import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    bannerUrl: { type: String, default: "" },
    management: [{
        name: { type: String, required: true },
        role: { type: String, required: true },
        imageUrl: { type: String, required: true }
    }],
    officeStaff: [{
        imageUrl: { type: String, required: true }
    }]
}, { timestamps: true });

const Team = mongoose.models.Team || mongoose.model("Team", teamSchema);
export default Team;