
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    scheduleId : {
        type: String,
        required: true,
        trim: true,

    },
    tripId: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    ticketClass: {
        type: String,
        required: true,
        enum: ["first", "standard", "premium"],
        lowercase: true,
        trim: true
    },
    selectedDay: {
        type: String,
        required: true,
        enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
        lowercase: true,
        trim: true
    },
    passengers :{
        
        type: [{
            firstname: { type: String, required: true},
            lastname: { type: String, required: true},
            email: {type: String, required: true},
            phone: { type: String, required: true}
        }],
        required: true,
        validate: {
            validator: function (passengers) {
                return passengers.length > 0;
            },
            message: "At least one passenger is required."
        }

    } 


}, { timestamps: true })

const booking = mongoose.model("Booking", bookingSchema)

export default booking