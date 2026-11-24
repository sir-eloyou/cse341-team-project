export const loadSessionUser = (req, res, next) => {
    req.user = req.session.user || null;
    res.locals.user = req.user;
    return next();
};

const isLoggedIn = (req) => {
    return Boolean(req.user);
};

const hasRole = (req, role) => {
    return req.user?.role === role;
};

// API authentication
export const requireApiLogin = (req, res, next) => {
    if (!isLoggedIn(req)) {
        return res.status(401).json({
            message: 'Authentication required'
        });
    }

    return next();
};

// Page authentication
export const requirePageLogin = (req, res, next) => {
    if (!isLoggedIn(req)) {
        req.session.returnTo = req.originalUrl;

        req.flash('error', 'Please login first.');

        return res.redirect('/login');
    }
    
    return next();
};

// API role authorization
export const requireApiRole = (role) => (req, res, next) => {
    if (!isLoggedIn(req)) {
        return res.status(401).json({
            message: 'Authentication required'
        });
    }

    if (!hasRole(req, role)) {
        return res.status(403).json({
            message: 'Forbidden'
        });
    }

    return next();
};

// Page role authorization
export const requirePageRole = (role) => (req, res, next) => {
    if (!isLoggedIn(req)) {
        req.session.returnTo = req.originalUrl;

        req.flash('error', 'Please login first.');

        return res.redirect('/login');
    }

    if (!hasRole(req, role)) {
        req.flash('error', 'You do not have permission to access this page.');

        return res.redirect('/');
    }

    return next();
};

export const requireGuest = (req, res, next) => {
    if (isLoggedIn(req)) {
        return res.redirect('/');
    }

    return next();
};