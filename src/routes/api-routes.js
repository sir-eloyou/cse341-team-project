import express from "express"
import { getAllTrips, getTripById } from "../controllers/trips.js"
import { getSchedulesForTrip } from "../controllers/schedules.js";


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


export default router