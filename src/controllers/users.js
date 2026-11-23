import { createUser, findUserByEmail, verifyPassword } from '../models/users.js';


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
                role: user.role.name
            };

            return req.session.save((err) => {
                if (err) {
                    console.error(err);
                    return res.redirect('/login');
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
export { registerUserPage, loginUserPage , registerUser, loginUser, adminDashboardPage, logoutUser };