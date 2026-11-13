import trip from "./schemas/trips.js";

export async function getTripById(tripId) {

    return await trip.findOne({ id: tripId}).lean()

    
}

export async function getAllTrips() {

    return await trip.find({}).lean()

    
}