import { getAllTrips as findAllTrips, getTripById as findTripById} from "../models/trips.js";

const getAllTrips = async (req, res) => {

    try {

        const trips = await findAllTrips()

        if (trips.length === 0) {

            return res.status(200).json({
                message: "No trips found"
            })
        }

        return res.status(200).json(trips)

    } catch(error) {
        console.error( "Error getting all trips: ", error.message)
        return res.status(500).json({
            message: "Server error"
        })
    }
}

const getTripById = async (req, res) => {

    try {

        const tripId = req.params.id;

        const trip = await findTripById(tripId)

        if (!trip) {
            return res.status(404).json({
                message: "No trip found"
            })
        }

        return res.status(200).json(trip)

    } catch(error) {
        console.error( "Error getting a trip: ", error.message)
        return res.status(500).json({
            message: "Server error"
        })
    }
    
}

export { getAllTrips, getTripById } ;