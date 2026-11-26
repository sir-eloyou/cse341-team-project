import express from "express"
import { getAllTrips, getTripById } from "../controllers/trips.js"
import { getSchedulesForTrip } from "../controllers/schedules.js";
import { getAllBookings } from "../controllers/bookings.js";
import { getAllUserBookings } from "../controllers/users.js";



const router = express.Router()


/**
 * @swagger
 * /api/trips:
 *  get:
 *      summary: Get all trips
 *      tags: 
 *          - Trips
 *      responses:
 *          200:
 *              description: Trips retrieved successfully
 *          500:
 *              description: Server error
 */
router.get("/trips", getAllTrips);




/**
 * @swagger
 * /api/trips/{id}:
 *  get:
 *      summary: Get a trip by ID
 *      tags: 
 *          - Trips
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *            description: MongoDB trip id
 * 
 *      responses:
 *          200:
 *              description: Trip found successfully
 *          404:
 *              description: Trip not found
 *          500:
 *              description: Server error
 */
router.get("/trips/:id", getTripById)


/**
 * @swagger
 * /api/trips/{id}/schedules:
 *   get:
 *     summary: Get schedules for a trip
 *     description: Returns all schedules associated with a specific trip. Optionally filter by operating month.
 *     tags:
 *       - Schedules
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique trip ID
 *         example: alpine-panorama
 *
 *       - in: query
 *         name: month
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Optional month number (1-12)
 *         example: 8
 *
 *     responses:
 *       200:
 *         description: Schedules retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       tripId:
 *                         type: string
 *                         example: alpine-panorama
 *                       departureTime:
 *                         type: string
 *                         example: "08:30"
 *                       arrivalTime:
 *                         type: string
 *                         example: "13:00"
 *                       daysOfWeek:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example:
 *                           - monday
 *                           - tuesday
 *                           - wednesday
 *                       status:
 *                         type: boolean
 *                         example: true
 *
 *       400:
 *         description: Invalid month number
 *
 *       404:
 *         description: Trip not found
 *
 *       500:
 *         description: Internal server error
 */
router.get("/trips/:id/schedules", getSchedulesForTrip);

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings
 *     description: Retrieve all bookings from the database.
 *     tags:
 *       - Bookings
 *     responses:
 *       200:
 *         description: Bookings retrieved successfully or no bookings found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Bookings retrieved successfully
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 6afdab0aa8da61c0cfe319e5
 *                       id:
 *                         type: string
 *                         example: JR2TLDB5V8
 *                       scheduleId:
 *                         type: string
 *                         example: "2"
 *                       tripId:
 *                         type: string
 *                         example: alpine-panorama
 *                       ticketClass:
 *                         type: string
 *                         enum: [first, standard, premium]
 *                         example: premium
 *                       selectedDay:
 *                         type: string
 *                         example: monday
 *                       passengers:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             firstname:
 *                               type: string
 *                               example: John
 *                             lastname:
 *                               type: string
 *                               example: Doe
 *                             email:
 *                               type: string
 *                               example: john@gmail.com
 *                             phone:
 *                               type: string
 *                               example: "09123456789"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.get("/bookings",getAllBookings)

router.get("/user-bookings", getAllUserBookings)
export default router