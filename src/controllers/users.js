import { createUser, findUserByEmail, verifyPassword , getAllUsers, getUserById, deleteUser, updateUser} from '../models/users.js';
import { getAllBookings } from '../models/bookings.js';
import schedule from '../models/schemas/schedules.js';
import { getTripById } from '../models/trips.js';


const registerUserPage = async (req, res) => {
    res.render('register', {
        title: 'Register'
    });
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        const normalizedEmail = email.trim().toLowerCase();

        // Check existing email
        const existingUser = await findUserByEmail(normalizedEmail);

        if (existingUser) {
            req.flash('error', 'Email already exists!');
            return res.redirect('/register');
        }

        // Validate password
        if (password !== confirmPassword) {
            req.flash('error', 'Passwords do not match!');
            return res.redirect('/register');
        }


        await createUser(
            name,
            normalizedEmail,
            password
        );

        req.flash('success', 'Registration successful!');
        return res.redirect('/login');

    } catch (error) {
        console.error(error);

        // Handle duplicate email error
        if (error.code === 11000) {
            req.flash('error', 'Email already exists!');
            return res.redirect('/register');
        }

        req.flash('error', 'Something went wrong!');
        return res.redirect('/register');
    }
};

const loginUserPage = async (req, res) => {
    res.render('login', {
        title: 'Login'
    });
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await findUserByEmail(email);

        if (!user) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }

        const isMatch = await verifyPassword(password, user.passwordHash);

        if (!isMatch) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }

        // Get the original destination before regenerating session
        const redirectTo = req.session.returnTo || '/';

        return req.session.regenerate((err) => {
            if (err) {
                console.error(err);
                return res.redirect('/login');
            }

            // Create new authenticated session
            req.session.user = {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role.name
            };

        
                

            return req.session.save((err) => {
                if (err) {
                    console.error(err);
                    return res.redirect('/login');
                }

                if (user.role.name === 'admin') {
                    return res.redirect('/admin-dashboard');
                }

                if (user.role.name === 'customer') {
                    return res.redirect('/user-dashboard');
                }

                return res.redirect(redirectTo);
            });
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message
        });
    }
};

const logoutUser = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: 'Error logging out'
            });
        }

        res.clearCookie('connect.sid');
        return res.redirect('/login');
    });
}

const adminDashboardPage = async (req, res) => {
    res.render('admin-dashboard', {
        title: 'Admin Dashboard'
    });
};

const userAdminPage = async (req, res) => {
    res.render('user-admin', {
        title: 'User Administration',
        user : req.session.user
    });
};
const userDashboardPage = async (req, res) => {
    res.render('user-dashboard', {
        title: 'User Dashboard',
        user: req.session.user
    });
}

const getAllUserBookings = async (req, res) => {
    try {

        const email = req.session.user.email;

        const bookings = await getAllBookings();

        const userBookings = bookings.filter(booking =>
            booking.passengers.some(passenger => passenger.email === email)
        );

        if (userBookings.length === 0) {
            return res.status(200).json({
                message: "There's no bookings",
                counts: 0,
                data: []
            });
        }

        const bookingsWithScheduleAndTripDetails = await Promise.all(
            userBookings.map(async (booking) => {

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

const getAllUsersHandler = async (req, res) => {
    try {
        const users = await getAllUsers();
        return res.status(200).json({
            message: "Users retrieved successfully",
            counts: users.length,
            data: users
        });
    } catch (error) {
        console.error("Error getting all users", error.message);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const deleteUserHandler = async (req, res) => {
    try {
        
        const loggedInUserId = req.session.user.id;
        const loggedInUserRole = req.session.user.role;

        const userId = req.params.id;

        if (
            loggedInUserRole !== 'admin' &&
            loggedInUserId !== userId
        ) {
            return res.status(403).json({
                message: 'You are not authorized to delete this user'
            });
        }

        const deletedUser = await deleteUser(userId);

        if (!deletedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User deleted successfully",
            data: deletedUser
        });
    } catch (error) {
        console.error("Error deleting user", error.message);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

const updateUserHandler = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, email, role } = req.body;

        const updatedUser = await updateUser(userId, { name, email, role });

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User updated successfully",
            data: updatedUser
        });
    } catch (error) {
        console.error("Error updating user", error.message);
        return res.status(500).json({
            message: "Internal server error"
        });
    }   
}

const getUserByIdHandler = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await getUserById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User retrieved successfully",
            data: user
        });
    } catch (error) {
        console.error("Error getting user by ID", error.message);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export { registerUserPage, loginUserPage , registerUser, loginUser, adminDashboardPage, logoutUser, userDashboardPage, userAdminPage, getAllUserBookings, getAllUsersHandler, deleteUserHandler, updateUserHandler, getUserByIdHandler };