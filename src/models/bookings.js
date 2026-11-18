import booking from "./schemas/bookings.js";

export async function createBooking(bookingData) {

    return await booking.create(bookingData)
    
}

export async function getAllBookings() {

    return await booking.find().lean()
    
}

export async function getBookingById(id) {

    return await booking.findOne({id}).lean()
    
}