
import schedule from "./schemas/schedules.js";
import trip from "./schemas/trips.js";


export async function getSchedulesByTripId(tripId, month) {

    // Find trip details
    const details = await trip.findOne({ id: tripId }).lean();

    if (!details) {
        throw new Error("Trip not found");
    }

    // Check operating month if provided
    if (month !== undefined) {

        if (!Number.isInteger(month) || month < 1 || month > 12) {
            throw new Error("Month must be between 1 and 12");
        }

        if (!details.operatingMonths.includes(month)) {
            details.schedules = [];
            return details;
        }
    }

    // Attach schedules to trip
    details.schedules = await schedule.find({ tripId })
        .sort({ departureTime: 1 })
        .lean();

    return details;
}