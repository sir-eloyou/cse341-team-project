import express from 'express';
import Path from 'path';
import { fileURLToPath } from 'url';
import pkg from './package.json' with { type: 'json' };
import globalMiddleware from './src/middleware/global.js';
import routes from './src/routes/router.js';
import swaggerUi from "swagger-ui-express";
import swaggerSpec from './swagger.js';
import cors from "cors";
import session from "express-session";
import flash from "express-flash";
import { loadSessionUser } from './src/middleware/auth.js';

const sessionSecret = process.env.SESSION_SECRET

const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);

const app = express();
app.use(cors());
// Add version info to res.locals for access in templates.
app.use((req, res, next) => {
    res.locals.appVersion = pkg.version;
    next();
});

// Configure static files and EJS templates.
app.use(express.static(Path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', Path.join(__dirname, 'src/views'));

// app.use(session({
//     secret: sessionSecret,
//     resave: false,
//     saveUninitialized: false,
//     cookie: { maxAge: 60 * 60 * 1000 } // Set to true if using HTTPS
// }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 30
    }
}));

app.use(loadSessionUser);

app.use(flash());

// Parse JSON and URL-encoded request bodies.
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.use(globalMiddleware);
app.use('/', routes);


//Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))



// Catch requests that did not match a route.
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// Render the appropriate error page.
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';
    const context = {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: err.stack
    };

    return res.status(status).render(`errors/${template}`, context);
});

export default app;
