import { createBooking, getAllBookings as findAllBookings } from "../models/bookings.js";
import { getTripById } from "../models/trips.js";
import { generateConfirmationCode } from '../includes/helpers.js';
import { getDb } from "../db/connect.js";
import scheduleSchema from "../models/schemas/schedules.js";
import schedule from "../models/schemas/schedules.js";


// const getAllBookings = async (req, res) => {

//     try {

//         const bookings = await findAllBookings();

        

//         if (bookings.length === 0) {
//             return res.status(200).json({
//                 message: "Theres no bookings",
//                 counts: 0,
//                 data: []
//             })
//         }

//         bookings.schedule = await schedule.findOne({ id : Number(bookings.scheduleId)})

       

//         return res.status(200).json({
//             message: "Bookings retrieved successfully",
//             counts: bookings.length,
//             data: bookings
            
//         })

//     } catch(error) {
//         console.error("Error getting all bookings", error.message)
//         return res.status(500).json({
//             message: "Internal server error"
//         })

//     }
// }

const getAllBookings = async (req, res) => {
    try {
        const bookings = await findAllBookings();

        if (bookings.length === 0) {
            return res.status(200).json({
                message: "There's no bookings",
                counts: 0,
                data: []
            });
        }

        const bookingsWithScheduleAndTripDetails = await Promise.all(
            bookings.map(async (booking) => {

                const scheduleData = await schedule.findOne({
                    id: Number(booking.scheduleId)
                });

                const tripData = await getTripById(booking.tripId)

                return {
                    ...booking,
                    trip: tripData,
                    schedule: scheduleData
                };

            })
        );

        return res.status(200).json({
            message: "Bookings retrieved successfully",
            counts: bookingsWithScheduleAndTripDetails.length,
            data: bookingsWithScheduleAndTripDetails
        });

    } catch (error) {
        console.error("Error getting all bookings", error.message);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const processBookingRequest = async (req, res) => {
    const confirmation = {
        id: generateConfirmationCode(),
        createdAt: new Date().toISOString(),
        ...req.body
    };
    await createBooking(confirmation)

    res.redirect(`/trips/confirmation/${confirmation.id}`);
};

const bookingPage = async (req, res) => {
    const { scheduleId } = req.params;

    const db = getDb()
    const schedule = await scheduleSchema.findOne({ id: Number(scheduleId)});
    const trip = await getTripById(schedule.tripId)
    const ticketClasses = await db.collection('ticketClasses').find({}).toArray();
    const ticketOptions = ticketClasses.map((ticketClass) => ({
        class: ticketClass.class,
        name: ticketClass.name,
        price: trip.distance * ticketClass.pricePerKm,
        amenities: ticketClass.amenities,
        description: ticketClass.description
    }));

    res.render('trips/book', {
        title: 'Book Trip',
        schedule,
        ticketOptions
    });
};

const bookingAdminPage = async (req, res) => {
    res.render('bookings', {
        title: "Bookings Admin Page"
    })
}

export {getAllBookings, processBookingRequest, bookingPage, bookingAdminPage}