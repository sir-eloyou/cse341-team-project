import { getSchedulesByTripId } from "../models/schedules.js";

const getSchedulesForTrip = async (req, res) => {
    try {
        const id = req.params.id;
        const { month } = req.query;

        const schedules = await getSchedulesByTripId(
            id,
            month !== undefined ? Number(month) : undefined
        );

        return res.status(200).json({
            success: true,
            count: schedules.length,
            data: schedules
        });

    } catch (error) {
        if (error.message === "Trip not found") {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        if (error.message === "Month must be between 1 and 12") {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        console.error("Error fetching schedules:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const getSchedulesForTripAndMonth = async (req, res) => {
    try {
        const { tripId, month } = req.params;

        const schedules = await getSchedulesByTripId(
            tripId,
            Number(month)
        );

        return res.status(200).json({
            success: true,
            count: schedules.length,
            data: schedules
        });

    } catch (error) {
        if (error.message === "Trip not found") {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        if (error.message === "Month must be between 1 and 12") {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export { getSchedulesForTrip, getSchedulesForTripAndMonth}