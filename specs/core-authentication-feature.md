# Core Authentication Spec - Version 1

## Feature 1: Core Authentication

### Goal

Implement a complete authentication system that allows users to register, log in, and log out of the application.

The application will use session-based authentication to maintain the logged-in user's identity and role across requests.

User information will be stored in MongoDB using new Mongoose schemas for users and roles. Passwords must be securely hashed before being stored in the database.

The authentication system must support role-based access control for both API endpoints and EJS pages.

Four middleware functions will be created to protect API routes and page routes based on authentication status and user roles.

A new Admin Dashboard page will also be created at `/admin`. This page will only be accessible to authenticated users who have the `admin` role.

This feature is a dependency for the remaining feature sets. It must be implemented, reviewed, and merged as soon as possible so that other team members can build on the authentication functionality.

### Data Models

Two new Mongoose schemas will be created for users and roles.

#### User Schema

The user schema will be created in:

`src/models/schemas/users.js`

User documents will contain the following fields:

| Field | Description |
| --- | --- |
| `displayName` | The user's display name. |
| `username` | The user's unique username. |
| `email` | The user's email address. |
| `passwordHash` | The securely hashed user password. |
| `role` | A reference to the user's assigned role. |

The user schema must:

- Use Mongoose to define the user document structure.
- Require a display name.
- Require a unique username.
- Require a valid email address.
- Require a password hash.
- Require a role associated with the Roles collection.
- Store the user's role using a Mongoose ObjectId reference to the Role schema.
- Use Mongoose timestamps to automatically generate `createdAt` and `updatedAt` fields.
- Store user documents in the `users` collection.

Passwords must never be stored as plain text.

#### Role Schema

The role schema will be created in:

`src/models/schemas/roles.js`

Role documents will contain the following field:

| Field | Description |
| --- | --- |
| `name` | The name of the role assigned to users. |

The role schema must:

- Use Mongoose to define the role document structure.
- Require a role name.
- Prevent duplicate role names.
- Store role documents in the `roles` collection.
- Support associating users with their assigned roles.

### Standard Roles

The database import scripts must be updated to insert the standard application roles.

The standard roles must include:

- `admin`
- `user`

The import script must:

- Create the standard roles in the database.
- Avoid creating duplicate role documents when executed multiple times.
- Ensure the standard roles are available when users register.
- Be executed by the team to ensure the roles exist in the shared development database.

The application must use the roles stored in MongoDB rather than relying on manually created role documents.

### Validation Rules

- Display name is required when registering.
- Username is required and must be unique.
- Email is required and must be valid.
- Email addresses must not be duplicated.
- Password is required when registering.
- Passwords must be securely hashed before being saved.
- Password hashes must never be returned in API responses or exposed to EJS pages.
- Every user must have an assigned role.
- The assigned role must reference an existing role document.
- Newly registered users must receive the standard `user` role by default.
- Users must not be able to assign themselves the `admin` role through registration.
- Login must verify the submitted credentials against the stored user information.
- Invalid login credentials must not create an authenticated session.
- Logging out must destroy the authenticated session.
- Unauthenticated users must not access protected pages or APIs.
- Authenticated users must not access pages or APIs requiring a role they do not possess.

### Authentication Pages

Two new EJS pages will be created for user authentication.

#### Registration Page

The registration page will be created in:

`src/views/register.ejs`

Purpose: Allow new users to create an account.

The page must:

- Provide an input for the user's display name.
- Provide an input for the username.
- Provide an input for the email address.
- Provide an input for the password.
- Provide an input for confirming the password.
- Include a registration button.
- Provide a link to the login page for existing users.
- Display appropriate validation or registration error messages.

The registration functionality must:

- Receive the submitted registration information.
- Validate the required fields.
- Verify that the username and email are not already registered.
- Hash the submitted password using an appropriate password-hashing library.
- Retrieve the standard `user` role from MongoDB.
- Create a new user document using the User schema.
- Assign the standard `user` role to the new account.
- Handle validation and database errors appropriately.
- Redirect the user to the login page after successful registration.

The registration process must not allow users to choose or assign privileged roles.

#### Login Page

The login page will be created in:

`src/views/login.ejs`

Purpose: Allow existing users to authenticate.

The page must:

- Provide an input for the username or email address, following the application's chosen login convention.
- Provide an input for the password.
- Include a login button.
- Provide a link to the registration page for users who do not have an account.
- Display appropriate login error messages.

The login functionality must:

- Receive the submitted login credentials.
- Find the corresponding user in MongoDB.
- Retrieve the stored password hash.
- Verify the submitted password against the stored password hash.
- Retrieve the user's role information.
- Store the authenticated user's information and role in the session.
- Regenerate the session upon successful authentication to prevent session fixation.
- Redirect the authenticated user to the appropriate page.
- Reject invalid credentials without creating an authenticated session.

The password hash must not be stored in the session.

### Session Management

The application will use session-based authentication to maintain the logged-in user's identity.

The session must store the authenticated user's relevant information, including:

- User ID.
- Display name.
- Username.
- Email.
- Role information.

The session must:

- Be created after successful login.
- Be available across subsequent requests.
- Allow middleware to identify the authenticated user.
- Make the user's role available for authorization checks.
- Be destroyed when the user logs out.
- Prevent unauthenticated users from accessing protected resources.

Sensitive information, especially password hashes, must not be stored in the session.

The session implementation must follow the approach demonstrated in the Session Authentication Middleware learning activity.

### Authentication Controllers

The authentication controller functionality will handle registration, login, and logout.

The authentication controller should be implemented in:

`src/controllers/auth.js`

#### registerPage

Purpose: Render the registration page.

The function will:

- Render `src/views/register.ejs`.
- Pass any required static information to the EJS template.
- Display the registration page when requested.

#### registerUser

Purpose: Process a new user's registration request.

The function will:

- Retrieve registration information from the request.
- Validate the submitted information.
- Check whether the username or email already exists.
- Hash the user's password.
- Retrieve the default `user` role.
- Create the user using the User model.
- Handle successful registration.
- Redirect the user to the login page.
- Handle validation and database errors appropriately.

#### loginPage

Purpose: Render the login page.

The function will:

- Render `src/views/login.ejs`.
- Pass any required static information to the EJS template.
- Display the login page when requested.

#### loginUser

Purpose: Authenticate an existing user.

The function will:

- Retrieve the submitted login credentials.
- Find the matching user in MongoDB.
- Verify the submitted password against the stored password hash.
- Retrieve the user's role.
- Regenerate the session after successful authentication.
- Store the authenticated user's information and role in the session.
- Redirect the user after successful login.
- Display an appropriate error when authentication fails.

#### logoutUser

Purpose: Log out the currently authenticated user.

The function will:

- Destroy the user's current session.
- Remove the authenticated user's session information.
- Redirect the user to the login page.
- Handle session destruction errors appropriately.

All authentication controller functions must be exported and connected to their appropriate routes.

### Authentication Middleware

Four middleware functions must be created to protect pages and APIs.

The middleware should be implemented in:

`src/middleware/auth.js`

#### requireApiLogin()

Purpose: Ensure that an API request is made by an authenticated user.

The function will:

- Check whether the request has an authenticated user session.
- Allow the request to continue if the user is authenticated.
- Return a JSON response with status `401` if the user is not authenticated.

Expected unauthenticated response:

json

```json
{
  "error": "Unauthorized"
}
```

Expected behavior:

- Authenticated users can continue to the requested API endpoint.
- Unauthenticated users receive status `401`.
- The response must be JSON.
- The middleware must not redirect API requests to an EJS login page.

#### requirePageLogin()

Purpose: Ensure that a user is authenticated before accessing a protected EJS page.

The function will:

- Check whether the user has an authenticated session.
- Allow the request to continue if the user is authenticated.
- Redirect unauthenticated users to the login page.

Expected behavior:

- Authenticated users can access the requested page.
- Unauthenticated users are redirected to `/login`.
- The middleware must prevent unauthenticated access to protected pages.

#### requireApiRole(role)

Purpose: Ensure that an API request is made by an authenticated user with the required role.

The function will:

- Accept a required role as a parameter.
- Check whether the request has an authenticated user session.
- Return status `401` if the user is not authenticated.
- Check the authenticated user's assigned role.
- Allow the request to continue if the user has the required role.
- Return status `403` if the user does not have the required role.

Expected unauthenticated response:

json

```json
{
  "error": "Unauthorized"
}
```

Expected insufficient-permission response:

json

```json
{
  "error": "Forbidden"
}
```

Expected behavior:

- Unauthenticated users receive status `401`.
- Authenticated users with the required role can continue.
- Authenticated users without the required role receive status `403`.
- All error responses must use JSON.

#### requirePageRole(role)

Purpose: Ensure that a user is authenticated and has the required role before accessing a protected EJS page.

The function will:

- Accept a required role as a parameter.
- Check whether the user has an authenticated session.
- Redirect unauthenticated users to `/login`.
- Check the authenticated user's assigned role.
- Allow the request to continue if the user has the required role.
- Redirect authenticated users without the required role to a `403` error page.

Expected behavior:

- Unauthenticated users are redirected to `/login`.
- Authenticated users with the required role can access the requested page.
- Authenticated users without the required role are redirected to the `403` error page.
- The middleware must prevent unauthorized access to protected pages.

All four middleware functions must be exported so they can be imported and used by API and EJS routes.

### Error Handling

A new EJS error page must be created for forbidden access.

The page should be created in:

`src/views/403.ejs`

Purpose: Inform users that they do not have permission to access a requested page.

The page must:

- Display an appropriate forbidden-access message.
- Clearly indicate that the user does not have the required permissions.
- Provide a link to return to an appropriate page.

The page must be used by `requirePageRole(role)` when an authenticated user does not have the required role.

The application must distinguish between:

- `401 Unauthorized`: The user is not authenticated.
- `403 Forbidden`: The user is authenticated but does not have the required permissions.

### Routes

Authentication routes must be added to the appropriate EJS routes file, following the existing project structure.

The routes must remain separate from API routes.

#### GET /register

Purpose: Display the registration page.

The route must:

- Call the `registerPage` controller.
- Render `src/views/register.ejs`.

#### POST /register

Purpose: Process a new user registration.

The route must:

- Call the `registerUser` controller.
- Create a new user account.
- Redirect to the login page after successful registration.

#### GET /login

Purpose: Display the login page.

The route must:

- Call the `loginPage` controller.
- Render `src/views/login.ejs`.

#### POST /login

Purpose: Authenticate a user.

The route must:

- Call the `loginUser` controller.
- Verify the submitted credentials.
- Create an authenticated session after successful login.

#### POST /logout

Purpose: Log out the authenticated user.

The route must:

- Call the `logoutUser` controller.
- Destroy the authenticated session.
- Redirect to `/login`.

Logout must use a POST request rather than a GET request to avoid triggering session destruction through an ordinary page visit or link preview.

### API Authentication and Role Protection

The authentication middleware must be available for use throughout the application's API routes.

The API routes must:

- Import the appropriate authentication middleware.
- Use `requireApiLogin()` for endpoints requiring authentication.
- Use `requireApiRole(role)` for endpoints requiring a specific role.
- Return JSON responses for authentication and authorization errors.
- Preserve the existing API response conventions.

This feature establishes the middleware functionality. Other feature sets can use these functions to protect their own API endpoints.

### EJS Authentication and Role Protection

The EJS routes must:

- Import the appropriate authentication middleware.
- Use `requirePageLogin()` for pages requiring authentication.
- Use `requirePageRole(role)` for pages requiring a specific role.
- Redirect unauthenticated users to the login page.
- Redirect authenticated users without the required role to the forbidden-access page.

This feature establishes the page-protection functionality for other feature sets.

### Admin Dashboard

A new Admin Dashboard page will be created at:

`src/views/admin.ejs`

The page will be accessible through:

`GET /admin`

Purpose: Provide an initial administration page that is only accessible to authenticated administrators.

The page must:

- Display the message:
  Welcome to the Admin Dashboard
- Require the user to be authenticated.
- Require the authenticated user's role to be `admin`.
- Use `requirePageRole('admin')` to protect the route.
- Redirect unauthenticated users to `/login`.
- Redirect authenticated users without the admin role to the `403` error page.

The dashboard does not need additional administration functionality for this feature set.

### Database Import Scripts

The existing database import scripts must be updated to include the standard application roles.

The implementation must:

- Import or create the Role model.
- Insert the standard `admin` and `user` roles.
- Avoid inserting duplicate roles.
- Ensure that role documents are available before users attempt to register.
- Follow the existing database import script conventions.
- Be executed by the team to verify that the standard roles are present in MongoDB.

The database import process must be repeatable without creating duplicate role records.

### Test Plan

The following checks will be performed to verify that Core Authentication works correctly.

#### Schema Tests

- Verify that the User schema exists in `src/models/schemas/users.js`.
- Verify that the Role schema exists in `src/models/schemas/roles.js`.
- Verify that user documents contain display name, username, email, password hash, and role.
- Verify that username is required and unique.
- Verify that email is required and unique.
- Verify that password hashes are required.
- Verify that users reference an existing role document.
- Verify that role names are required and unique.
- Verify that Mongoose timestamps are generated.
- Verify that passwords are not stored as plain text.

#### Database Import Tests

- Execute the database import script.
- Verify that the `admin` role exists.
- Verify that the `user` role exists.
- Execute the import script again.
- Verify that duplicate roles are not created.
- Verify that the roles can be retrieved from MongoDB.

#### Registration Tests

- Navigate to `/register` and verify that the registration page loads.
- Verify that all required registration fields are displayed.
- Register a user with valid information.
- Verify that the password is hashed before storage.
- Verify that the user is assigned the standard `user` role.
- Verify that the user document is saved in MongoDB.
- Attempt registration with an existing username and verify that the request is rejected.
- Attempt registration with an existing email and verify that the request is rejected.
- Attempt registration with missing required information and verify that validation errors are handled.
- Verify that users cannot register with the `admin` role.
- Verify that successful registration redirects to `/login`.

#### Login Tests

- Navigate to `/login` and verify that the login page loads.
- Log in using valid credentials.
- Verify that the password is checked against the stored password hash.
- Verify that successful login creates an authenticated session.
- Verify that the session contains the user's ID, display name, username, email, and role.
- Verify that the password hash is not stored in the session.
- Attempt login with an incorrect password and verify that authentication fails.
- Attempt login with a nonexistent user and verify that authentication fails.
- Verify that unsuccessful login does not create an authenticated session.
- Verify that successful login redirects the user appropriately.

#### Logout Tests

- Log in successfully.
- Send a POST request to `/logout`.
- Verify that the session is destroyed.
- Verify that the user is no longer authenticated.
- Verify that protected pages cannot be accessed after logout.
- Verify that the user is redirected to `/login`.

#### Middleware Tests

requireApiLogin()

- Verify that authenticated API requests are allowed.
- Verify that unauthenticated API requests return status `401`.
- Verify that the response is JSON.
- Verify that the middleware does not redirect API requests.

requirePageLogin()

- Verify that authenticated users can access protected pages.
- Verify that unauthenticated users are redirected to `/login`.

requireApiRole(role)

- Verify that unauthenticated users receive status `401`.
- Verify that authenticated users with the required role can access the endpoint.
- Verify that authenticated users without the required role receive status `403`.
- Verify that error responses are returned as JSON.

requirePageRole(role)

- Verify that unauthenticated users are redirected to `/login`.
- Verify that authenticated users with the required role can access the page.
- Verify that authenticated users without the required role are redirected to the `403` error page.

#### Admin Dashboard Tests

- Navigate to `/admin` while unauthenticated and verify that the user is redirected to `/login`.
- Log in as a standard user and navigate to `/admin`.
- Verify that the standard user is redirected to the `403` error page.
- Log in as an administrator and navigate to `/admin`.
- Verify that the Admin Dashboard loads successfully.
- Verify that the page displays "Welcome to the Admin Dashboard".
- Verify that the route uses `requirePageRole('admin')`.

#### Error Page Tests

- Navigate to the forbidden-access page.
- Verify that the `403` page renders successfully.
- Verify that the page displays an appropriate permission-denied message.
- Verify that users have an option to navigate away from the error page.

#### Routing Tests

- Verify that GET `/register` renders the registration page.
- Verify that POST `/register` processes registration.
- Verify that GET `/login` renders the login page.
- Verify that POST `/login` processes authentication.
- Verify that POST `/logout` destroys the session.
- Verify that GET `/admin` is protected by the admin role middleware.
- Verify that the authentication routes are registered correctly.
- Verify that API and EJS routes remain separate.
- Verify that all middleware and controller functions are exported and imported correctly.

### Deployment Expectations

After implementation, the Core Authentication functionality must work locally and from the deployed Render application.

The deployed application must:

- Connect to the MongoDB database successfully.
- Have the standard `admin` and `user` roles available.
- Allow new users to register.
- Store user information securely.
- Hash passwords before saving them.
- Allow registered users to log in.
- Maintain authenticated sessions across requests.
- Allow users to log out.
- Correctly enforce authentication middleware for pages and APIs.
- Correctly enforce role-based access restrictions.
- Prevent standard users from accessing administrator-only pages.
- Allow administrators to access `/admin`.
- Display the appropriate `401` and `403` responses or pages depending on the request type.

The authentication system must be fully functional before the remaining feature sets are implemented.

All subsequent features must be able to reuse the authentication session and middleware functions without needing to implement authentication independently.

The implementation must follow the Session Authentication Middleware learning activity and the existing project structure and conventions.