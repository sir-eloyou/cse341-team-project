
import { trainsApi, trainsPage } from './trains.js';
import { Router } from 'express';
import { homePage, aboutPage, testErrorPage } from './index.js';
import apiRoutes from './api-routes.js'
import ejsRoutes from './ejs-routes.js'
import { bookingAdminPage } from '../controllers/bookings.js';
import { registerUserPage, loginUserPage, registerUser, loginUser } from '../controllers/users.js';
import { adminDashboardPage } from '../controllers/users.js';
import {requirePageRole} from '../middleware/auth.js';

const router = Router();

// Home page
router.get('/', homePage);

// About page
router.get('/about', aboutPage);

// Trains page
router.get('/trains', trainsPage);

// Trains API
router.get('/api/trains', trainsApi);

// Rail trips
router.use('/trips', ejsRoutes);

// Test 500 error page
router.get('/500', testErrorPage);

router.use("/api", apiRoutes)

router.get("/bookings-admin", bookingAdminPage )

// User registration and login routes
router.get('/register', registerUserPage);
router.post('/register', registerUser);
router.get('/login', loginUserPage);
router.post('/login', loginUser);
router.get('/admin-dashboard', requirePageRole('admin'), adminDashboardPage);

export default router;