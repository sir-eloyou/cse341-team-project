import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({

    id: {
        type: Number,
        unique: true,
        required: true,
        min: 1

    },
    tripId: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    departureTime: {
        type: String,
        required: true,
        trim: true,
        match: /^([01]\d|2[0-3]):[0-5]\d$/
    },
    arrivalTime: {
        type: String,
        required: true,
        trim: true,
        match: /^([01]\d|2[0-3]):[0-5]\d$/
    },
    daysOfWeek: {
        type: [{
            type: String,
            enum: [
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
                "sunday"
            ],
            trim: true,
            lowercase: true
        }],
        required: true,
        validate: {
            validator: days => days.length > 0,
            message: "At least one operating day is required"
        }
    },
    status : {
        type: Boolean,
        required: true
    }
}, { timestamps: true })

const schedule = mongoose.model("Schedule", scheduleSchema)

export default schedule;