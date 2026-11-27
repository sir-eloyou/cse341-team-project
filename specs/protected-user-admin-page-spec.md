# Protected User Admin Page Spec – Version 1

## Feature Set 3: Protected User Admin Page, User Management API, and Authorization

### Goal

Create a protected user administration page that allows authenticated users to view, update, and delete user information.

The page must require authentication. Users who are not authenticated must be redirected to the login page.

The page must display different user information depending on the authenticated user's role:

- Administrators can view all registered users.
- Regular users can only view their own user information.

The user list must be populated dynamically using client-side JavaScript by retrieving user information through the Users API.

The application must also provide update and delete functionality through the API. Regular users can update or delete only their own accounts, while administrators can update or delete any user's account.

The implementation must include the necessary user model functions, API controllers, routes, authentication and authorization checks, Swagger documentation, and frontend functionality.

The admin dashboard must also be updated to include a link to the protected user administration page.

### Data Model

The feature will use the existing User model and Mongoose schema.

The existing user schema is located in:

`src/models/schemas/users.js`

The user model functions will be implemented or updated in:

`src/models/users.js`

The implementation must:

- Use the existing User schema.
- Retrieve user information from the MongoDB users collection.
- Support retrieving all users.
- Support retrieving an individual user by ID.
- Support updating user information.
- Support deleting a user account.
- Preserve existing user information and relationships.
- Handle user roles correctly, including the relationship between users and roles.

The user role must be retrieved in a format that allows the application to identify whether the authenticated user is an administrator or a regular user.

If the role is stored as a MongoDB ObjectId reference, the implementation must use the appropriate role information when checking permissions.

### Validation Rules

- A user must be authenticated before accessing the protected user administration page.
- Unauthenticated users must be redirected to the login page.
- Administrators must be able to retrieve all registered users.
- Regular users must only be able to retrieve their own user information.
- A regular user must not retrieve another user's information.
- A regular user must only update their own account.
- A regular user must only delete their own account.
- Administrators must be allowed to update any user's account.
- Administrators must be allowed to delete any user's account.
- User IDs must be validated before performing database operations.
- Required user fields must be validated when updating user information.
- Invalid update requests must return an appropriate error response.
- A user who does not exist must return an appropriate not-found response.
- Unauthorized actions must return HTTP status `403`.
- Unauthenticated API requests must return HTTP status `401`.
- Password information must not be exposed in API responses.
- Database errors must be handled appropriately.
- Updating or deleting a user must update the frontend list without requiring a page refresh.

### Routes

#### GET /api/users

Purpose: Retrieve user information from the database.

The endpoint must:

- Allow administrators to retrieve all registered users.
- Allow regular users to retrieve only their own user information.
- Use the authenticated user's session to determine their identity and role.
- Prevent regular users from retrieving other users' information.

Success:

- Status code: `200`
- Response body: an object containing a `data` array of user objects for administrators.
- Regular users receive their own user information.

Example administrator response:

```json
{
  "data": [
    {
      "_id": "672abc123456789012345678",
      "name": "John Smith",
      "email": "john@example.com",
      "role": {
        "_id": "6b01ab5f1f931cd2da27efa5",
        "name": "admin"
      }
    }
  ]
}
```

Example regular user response:

```json
{
  "data": [
    {
      "_id": "672abc123456789012345678",
      "name": "John Smith",
      "email": "john@example.com",
      "role": {
        "_id": "6b01ab5f1f931cd2da27efa4",
        "name": "user"
      }
    }
  ]
}
```

Errors:

- `401` if the user is not authenticated.
- `500` if an unexpected server or database error occurs.

#### GET /api/users/{id}

Purpose: Retrieve an individual user's information using their MongoDB ID.

The endpoint must:

- Retrieve the user identified by the supplied ID.
- Allow administrators to retrieve any user.
- Allow regular users to retrieve only their own information.
- Use the authenticated user's session to determine permissions.
- Exclude sensitive information such as passwords.

Parameters:

- `id`: Required. MongoDB user ID.

Success:

- Status code: `200`
- Response body: an object containing the requested user information.

Example response:

```json
{
  "data": {
    "_id": "672abc123456789012345678",
    "name": "John Smith",
    "email": "john@example.com",
    "role": {
      "_id": "6b01ab5f1f931cd2da27efa4",
      "name": "user"
    }
  }
}
```

Errors:

- `401` if the user is not authenticated.
- `403` if a regular user attempts to retrieve another user's information.
- `404` if the requested user does not exist.
- `500` if an unexpected server or database error occurs.

#### PUT /api/users/{id}

Purpose: Update an existing user's information.

The endpoint must:

- Receive the user ID through the URL parameter.
- Receive the updated user information through the request body.
- Allow regular users to update only their own account.
- Allow administrators to update any user's account.
- Validate the submitted information.
- Update the corresponding user document in MongoDB.
- Return the updated user information.
- Exclude sensitive information such as passwords from the response.

Parameters:

- `id`: Required. MongoDB user ID.

Request body example:

```json
{
  "name": "John Updated",
  "email": "johnupdated@example.com"
}
```

Success:

- Status code: `200`
- Response body: an object containing a success message and the updated user information.

Example response:

```json
{
  "message": "User updated successfully",
  "data": {
    "_id": "672abc123456789012345678",
    "name": "John Updated",
    "email": "johnupdated@example.com",
    "role": {
      "name": "user"
    }
  }
}
```

Errors:

- `400` if the submitted information is invalid.
- `401` if the user is not authenticated.
- `403` if a regular user attempts to update another user's account.
- `404` if the requested user does not exist.
- `500` if an unexpected server or database error occurs.

#### DELETE /api/users/{id}

Purpose: Delete an existing user account.

The endpoint must:

- Receive the user ID through the URL parameter.
- Allow regular users to delete only their own account.
- Allow administrators to delete any user account.
- Verify the authenticated user's identity and role before deleting.
- Delete the corresponding user document from MongoDB.
- Return an appropriate success response.

Parameters:

- `id`: Required. MongoDB user ID.

Success:

- Status code: `200`
- Response body: an object containing a success message.

Example response:

```json
{
  "message": "User deleted successfully"
}
```

Errors:

- `401` if the user is not authenticated.
- `403` if a regular user attempts to delete another user's account.
- `404` if the requested user does not exist.
- `500` if an unexpected server or database error occurs.

### Model Functions

The following model functions will be implemented in:

`src/models/users.js`

These functions must use Mongoose and the existing User schema to retrieve, update, and delete user documents.

#### getAllUsers

Purpose: Retrieve all registered users from the MongoDB users collection.

The function will:

- Query the users collection.
- Retrieve all user documents.
- Populate the role reference when necessary.
- Exclude password information from the returned documents.
- Return an array containing all users.

Expected result:

- Returns an array of user documents when users exist.
- Returns an empty array when no users exist.
- Handles database errors appropriately.

#### getUserById

Purpose: Retrieve an individual user using their MongoDB ID.

Parameters:

- `userId`: Required. The unique MongoDB ID of the user.

The function will:

- Receive the user ID.
- Query the users collection using the supplied ID.
- Populate the user's role when necessary.
- Exclude password information.
- Return the matching user document.

Expected result:

- Returns the matching user document when found.
- Returns `null` when no matching user exists.
- Handles database errors appropriately.

#### updateUser

Purpose: Update an existing user's information.

Parameters:

- `userId`: Required. The MongoDB ID of the user to update.
- `updateData`: Required. Contains the validated user information to update.

The function will:

- Receive the target user ID.
- Receive the updated user information.
- Update the matching user document using Mongoose.
- Return the updated user document.
- Populate the role reference when necessary.
- Exclude password information from the returned document.

Expected result:

- Returns the updated user document when successful.
- Returns `null` when the user does not exist.
- Handles validation and database errors appropriately.

#### deleteUser

Purpose: Delete an existing user from the MongoDB users collection.

Parameters:

- `userId`: Required. The MongoDB ID of the user to delete.

The function will:

- Receive the target user ID.
- Find the matching user document.
- Delete the user document from MongoDB.
- Return the deleted user document or an equivalent success result.

Expected result:

- Returns the deleted user document when successful.
- Returns `null` when the user does not exist.
- Handles database errors appropriately.

### API Controllers

The following API controller functions will be implemented in:

`src/controllers/users.js`

#### getAllUsersHandler

Purpose: Retrieve users based on the authenticated user's role.

The function will:

- Retrieve the authenticated user's ID and role from the server-side session.
- Check whether the authenticated user has the administrator role.
- If the user is an administrator, call `getAllUsers()`.
- If the user is a regular user, call `getUserById()` using the authenticated user's ID.
- Return the appropriate user information as JSON.
- Return status `200` when successful.
- Return status `401` when the user is not authenticated.
- Handle database errors and return status `500`.

#### getUserByIdHandler

Purpose: Retrieve an individual user by ID.

The function will:

- Retrieve the authenticated user's ID and role from the session.
- Retrieve the requested user ID from the route parameter.
- Check whether the authenticated user is an administrator.
- Allow administrators to retrieve any user.
- Allow regular users to retrieve only their own information.
- Call `getUserById()` to retrieve the requested user.
- Return the user information as JSON.
- Return status `403` when a regular user attempts to retrieve another user's information.
- Return status `404` when the user does not exist.

#### updateUserHandler

Purpose: Update an existing user's information through the API.

The function will:

- Retrieve the authenticated user's ID and role from the session.
- Retrieve the target user ID from the route parameter.
- Retrieve the updated information from the request body.
- Check whether the authenticated user is an administrator.
- Allow administrators to update any user.
- Allow regular users to update only their own account.
- Validate the submitted user information.
- Call `updateUser()` to update the user document.
- Return the updated user information as JSON.
- Return status `200` when successful.
- Return status `400` for invalid information.
- Return status `401` when unauthenticated.
- Return status `403` when the user is not authorized.
- Return status `404` when the requested user does not exist.
- Handle database errors and return status `500`.

#### deleteUserHandler

Purpose: Delete an existing user's account through the API.

The function will:

- Retrieve the authenticated user's ID and role from the session.
- Retrieve the target user ID from the route parameter.
- Check whether the authenticated user is an administrator.
- Allow administrators to delete any user.
- Allow regular users to delete only their own account.
- Call `deleteUser()` to remove the user document.
- Return a success message when deletion succeeds.
- Return status `401` when unauthenticated.
- Return status `403` when the user is not authorized.
- Return status `404` when the requested user does not exist.
- Handle database errors and return status `500`.

### Swagger Documentation

Swagger must document the Users API routes.

The documentation must include:

- HTTP method and endpoint path.
- Endpoint description.
- Authentication requirements.
- Authorization behavior for administrators and regular users.
- Required path parameters.
- Request body schema for updating users.
- Successful response formats.
- Possible error status codes.
- JSON response schemas.
- User object properties.
- Role information included in the user response.
- Appropriate security definitions for session-based authentication.

The following endpoints must be documented:

- `GET /api/users`
- `GET /api/users/{id}`
- `PUT /api/users/{id}`
- `DELETE /api/users/{id}`

The protected update and delete endpoints must document the authentication requirement.

The Swagger documentation must be added alongside the existing API documentation and must allow the endpoints to be tested through the Swagger interface.

### API Routes

The Users API routes will be implemented in:

`src/routes/api-routes.js`

Required routes:

#### GET /api/users

Purpose: Retrieve users based on the authenticated user's role.

The route must:

- Use the HTTP GET method.
- Call `getAllUsersHandler`.
- Require authentication.
- Return JSON responses.
- Allow administrators to retrieve all users.
- Allow regular users to retrieve only their own information.
- Be documented in Swagger.

#### GET /api/users/:id

Purpose: Retrieve an individual user.

The route must:

- Use the HTTP GET method.
- Call `getUserByIdHandler`.
- Require authentication.
- Return JSON responses.
- Enforce user access permissions.
- Be documented in Swagger.

#### PUT /api/users/:id

Purpose: Update an existing user.

The route must:

- Use the HTTP PUT method.
- Call `updateUserHandler`.
- Require authentication using the existing authentication middleware.
- Return JSON responses.
- Enforce administrator and regular-user permissions.
- Be documented in Swagger.

#### DELETE /api/users/:id

Purpose: Delete an existing user.

The route must:

- Use the HTTP DELETE method.
- Call `deleteUserHandler`.
- Require authentication using the existing authentication middleware.
- Return JSON responses.
- Enforce administrator and regular-user permissions.
- Be documented in Swagger.

The API routes must remain separate from the EJS routes.

- API routes return JSON responses.
- EJS routes render HTML pages.

### EJS Routes and Controller Routing

A new protected user administration page must be created at:

`/users-admin`

The EJS controller function will be implemented in:

`src/controllers/users.js`

#### usersAdminPage

Purpose: Render the protected user administration page.

The function will:

- Check whether the user is authenticated.
- Redirect unauthenticated users to `/login`.
- Retrieve the authenticated user's information from the session.
- Render the user administration EJS page.
- Pass the current user's information or role to the EJS template when needed.
- Not retrieve all user records for server-side rendering.
- Allow client-side JavaScript to retrieve user information through the Users API.

The EJS route must:

- Use the GET method.
- Render the user administration page.
- Require authentication.
- Redirect unauthenticated users to the login page.
- Be registered alongside the existing EJS routes.

### Frontend: Protected User Administration Page

A new EJS page will be created at:

`src/views/users-admin.ejs`

The page must use the web service hydration approach.

The page must not use EJS loops to retrieve and render user records directly.

Instead, client-side JavaScript will:

- Load the protected user administration page.
- Retrieve the current user's role.
- Fetch user information from `/api/users` when the page loads.
- Include session credentials when making API requests.
- Parse the JSON response.
- Retrieve the user information from the API response.
- Dynamically populate the users table.
- Display relevant user information, including name, email, and role.
- Handle empty user results appropriately.
- Handle API request errors appropriately.

#### User Display Permissions

The frontend must display different information depending on the authenticated user's role.

Administrators:

- Can see all registered users.
- Can see each user's name, email, and role.
- Can edit any user's information.
- Can delete any user's account.

Regular users:

- Can see only their own user information.
- Can edit their own account.
- Can delete their own account.
- Must not see other users' information.

The frontend must not rely on hidden buttons or client-side role checks as the only authorization mechanism. The API must independently enforce all permissions.

### Frontend: Update User Functionality

The user administration page must provide an Edit action.

When the Edit button is selected, client-side JavaScript must:

- Retrieve the selected user's information through the API.
- Populate the edit form with the existing user information.
- Display the edit form or modal.
- Allow the user to modify the permitted fields.
- Submit the updated information through a PUT request to `/api/users/{id}`.
- Include the appropriate session credentials.
- Handle successful and unsuccessful responses.

After a successful update:

- Close the edit modal.
- Retrieve the updated user information or refresh the user list through the API.
- Dynamically update the users table.
- Display a success message.
- Do not require a full page refresh.

If the update fails, the page must display an appropriate error message.

### Frontend: Delete User Functionality

The user administration page must provide a Delete action.

When the Delete button is selected, client-side JavaScript must:

- Ask the user to confirm the deletion.
- Send a DELETE request to `/api/users/{id}`.
- Include the appropriate session credentials.
- Handle successful and unsuccessful responses.

After successful deletion:

- Retrieve the updated user list through the API.
- Dynamically update the users table.
- Remove the deleted user's information from the displayed list.
- Display a success message.
- Do not require a full page refresh.

If the deletion fails, the page must display an appropriate error message.

If a regular user deletes their own account, the application must handle the resulting session and navigation appropriately.

### Admin Dashboard Integration

The existing admin dashboard must be updated to include a link to the protected user administration page.

The implementation must:

- Add a navigation link or dashboard item for User Management.
- Link to `/users-admin`.
- Allow administrators to access the user administration page.
- Preserve the existing admin dashboard functionality.

### Test Plan

The following checks will be performed to verify that the Protected User Admin Page feature works correctly.

#### Authentication Tests

- Navigate to `/users-admin` without logging in and verify that the application redirects to `/login`.
- Log in with a valid user account and verify that the protected page loads.
- Verify that unauthenticated API requests return status `401`.
- Verify that authenticated users can access the appropriate user administration functionality.

#### Role and Authorization Tests

- Log in as an administrator and verify that all users are displayed.
- Log in as a regular user and verify that only their own information is displayed.
- Verify that a regular user cannot retrieve another user's information.
- Verify that a regular user cannot update another user's information.
- Verify that a regular user cannot delete another user's account.
- Verify that an administrator can retrieve any user's information.
- Verify that an administrator can update any user's information.
- Verify that an administrator can delete any user's account.
- Verify that unauthorized update and delete requests return status `403`.
- Verify that frontend permission checks do not replace backend authorization checks.

#### Model Tests

- Call `getAllUsers()` and verify that all user documents are returned.
- Verify that `getAllUsers()` returns an empty array when no users exist.
- Call `getUserById()` with an existing user ID and verify that the correct user is returned.
- Call `getUserById()` with a nonexistent ID and verify that an empty result is returned.
- Call `updateUser()` with valid user information and verify that the user document is updated.
- Call `updateUser()` with a nonexistent user ID and verify that no user is updated.
- Call `deleteUser()` with an existing user ID and verify that the user document is deleted.
- Call `deleteUser()` with a nonexistent user ID and verify that an empty result is returned.
- Verify that role information is populated correctly when required.
- Verify that password information is not exposed in returned user data.
- Verify that database errors are handled appropriately.

#### API Tests

- Send a GET request to `/api/users` as an administrator and verify that all users are returned with status `200`.
- Send a GET request to `/api/users` as a regular user and verify that only their own information is returned.
- Send a GET request to `/api/users/:id` as an authorized user and verify that the correct user is returned.
- Send a GET request to `/api/users/:id` as a regular user attempting to access another user and verify that status `403` is returned.
- Send a PUT request to `/api/users/:id` with valid user information and verify that the user is updated.
- Send a PUT request as a regular user attempting to update another user and verify that status `403` is returned.
- Send a PUT request as an administrator attempting to update another user and verify that the update succeeds.
- Send a DELETE request to `/api/users/:id` as a regular user deleting their own account and verify that deletion succeeds.
- Send a DELETE request as a regular user attempting to delete another user and verify that status `403` is returned.
- Send a DELETE request as an administrator deleting another user and verify that deletion succeeds.
- Verify that unauthenticated requests return status `401`.
- Verify that nonexistent user IDs return status `404`.
- Verify that invalid update requests return status `400`.
- Verify that database errors return status `500`.
- Verify that the API response does not expose password information.

#### Swagger Documentation Tests

- Verify that `GET /api/users` is documented.
- Verify that `GET /api/users/{id}` is documented.
- Verify that `PUT /api/users/{id}` is documented.
- Verify that `DELETE /api/users/{id}` is documented.
- Verify that request body schemas are documented for the update endpoint.
- Verify that authentication requirements are documented.
- Verify that authorization behavior and possible error responses are documented.
- Verify that all endpoints can be viewed and tested through Swagger UI.

#### Frontend Tests

- Navigate to `/users-admin` while authenticated and verify that the page loads.
- Verify that the page retrieves user information from `/api/users`.
- Verify that the API response is parsed correctly.
- Verify that administrators see all users.
- Verify that regular users see only their own information.
- Verify that the user list is dynamically populated using client-side JavaScript.
- Verify that user records are not rendered using EJS loops.
- Select Edit and verify that the selected user's information appears in the edit form.
- Update a user's information and verify that the changes appear without refreshing the page.
- Select Delete and verify that a confirmation message appears.
- Confirm deletion and verify that the deleted user disappears from the list without refreshing the page.
- Verify that successful update and delete operations display appropriate messages.
- Verify that unsuccessful operations display appropriate error messages.
- Verify that API request errors are handled appropriately.
- Verify that regular users cannot see Edit or Delete actions for other users.

#### EJS Controller and Routing Tests

- Verify that `usersAdminPage` is implemented in `src/controllers/users.js`.
- Verify that the function checks authentication.
- Verify that unauthenticated users are redirected to `/login`.
- Verify that authenticated users can access the user administration page.
- Verify that the `/users-admin` EJS route is registered.
- Verify that `/users-admin` renders the correct EJS template.
- Verify that the EJS controller does not retrieve all users for server-side rendering.
- Verify that the API routes and EJS routes remain separate.

#### Admin Dashboard Tests

- Verify that the admin dashboard includes a User Management link.
- Verify that the link navigates to `/users-admin`.
- Verify that administrators can access the user administration page through the dashboard.
- Verify that existing dashboard functionality remains intact.

### Deployment Expectations

After implementation, the Protected User Admin Page and Users API must work locally and from the deployed Render application.

The deployed application must:

- Protect the `/users-admin` page through authentication.
- Redirect unauthenticated users to `/login`.
- Allow administrators to view all users.
- Allow regular users to view only their own information.
- Allow users to update and delete their own accounts.
- Allow administrators to update and delete any user account.
- Enforce authorization through backend API controllers.
- Return appropriate JSON responses and HTTP status codes.
- Support dynamic user list population through the Users API.
- Update the displayed user list after successful update and delete operations without requiring a page refresh.
- Display the User Management link in the admin dashboard.
- Provide Swagger documentation for the Users API at `/api-docs`.

The implementation must preserve existing user authentication, session management, role relationships, and application functionality while ensuring that all user management operations are properly authenticated and authorized.