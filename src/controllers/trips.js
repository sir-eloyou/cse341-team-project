import { getAllTrips as findAllTrips, getTripById as findTripById} from "../models/trips.js";
import { getDb } from '../db/connect.js';
const getAllTrips = async (req, res) => {

    try {

        const trips = await findAllTrips()

        if (trips.length === 0) {

            return res.status(200).json({
                message: "No trips found"
            })
        }

        return res.status(200).json({
            trips: trips
        })

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

const detailsPageHandler = async (req, res) => {
    const { tripId } = req.params;
    const db = getDb()
    const details = await findTripById(tripId);
    details.schedules = await db.collection('schedules').find({ tripId }).toArray();

    res.render('trips/details', {
        title: 'Trip Details',
        details
    });
};

const listPageHandler = async (req, res) => {
    const db = getDb();
    const [regions, seasons] = await Promise.all([
        db.collection('trips').distinct('region'),
        db.collection('trips').distinct('bestSeason')
    ]);

    res.render('trips/list', {
        title: 'Scenic Train Trips',
        regions,
        seasons,
    });
};

export { getAllTrips, getTripById , detailsPageHandler, listPageHandler} ;