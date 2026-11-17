
import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({

    id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    region: {
        type: String,
        required: true,
        trim: true
    },

    startStation: {
        type: String,
        required: true,
        trim: true
    },

    endStation: {
        type: String,
        required: true,
        trim: true
    },

    duration: {
        type: String,
        required: true,
        trim: true
    },

    distance: {
        type: Number,
        required: true,
        min: 0
    },

    highlights: {
        type: [{
            type: String,
            trim: true
        }],
        required: true,
        validate: {
            validator: arr => arr.length > 0,
            message: "At least one highlight is required"
        }
    },

    bestSeason: {
        type: String,
        enum: ["summer", "autumn", "spring", "winter"],
        required: true,
        lowercase: true,
        trim: true
    },

    operatingMonths: {
        type: [{
            type: Number,
            enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        }],
        required: true,
        validate: {
            validator: arr => new Set(arr).size === arr.length,
            message: "Duplicate months are not allowed"
        }
    },

    imageUrl: {
        type: String,
        required: true,
        trim: true
    }

}, { timestamps: true });

const trip = mongoose.model("Trip", tripSchema);

export default trip;
