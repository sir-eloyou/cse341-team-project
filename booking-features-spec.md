# Bookings API Spec - Version 1

## Feature 3: Bookings API, Booking Model Refactoring, and Admin Page Hydration

### Goal

Create a Bookings API that allows users to retrieve all bookings and retrieve an individual booking by its ID.

Currently, the application stores booking information in a MongoDB collection named `confirmations`. For this feature, the collection and all related code must be renamed to use the term `bookings` instead of `confirmations`.

Booking information will be stored in MongoDB using a new Mongoose schema.

The API must provide JSON responses with appropriate HTTP status codes and be documented in Swagger.

The existing booking functionality will also be refactored. The `processBookingRequest` and `bookingPage` controller functions will be moved into `src/controllers/bookings.js` and updated to use the new booking model functions.

A new bookings administration page will be created at `/bookings-admin`. This page will use the web service hydration approach. Instead of using EJS to render booking records, client-side JavaScript will fetch booking information from the Bookings API and dynamically populate the bookings list.

The feature must preserve the existing booking functionality while updating the underlying data model, API, controllers, and frontend implementation.

### Data Model

Booking documents will be stored in the `bookings` collection.

The Mongoose schema will be created in:

`src/models/schemas/bookings.js`

Required booking fields should follow the existing booking and confirmation data structure in the project.

The booking schema must:

- Use Mongoose to define the booking document structure.
- Include all required booking information.
- Include passenger information associated with the booking.
- Include any necessary trip, train, or schedule information associated with the booking.
- Preserve the existing booking information required by the application's booking process.
- Use Mongoose timestamps to automatically generate `createdAt` and `updatedAt` fields.
- Store booking documents in the `bookings` collection instead of `confirmations`.

The new schema must be compatible with the existing booking functionality so that creating and retrieving bookings continues to work correctly.

### Validation Rules

- All required booking fields must be provided when creating a booking.
- Passenger information must be included when required by the existing booking process.
- Booking documents must be stored in the `bookings` collection.
- Each booking must have a unique identifier.
- Booking documents must be retrievable using their ID.
- The application must use the new bookings model instead of the previous confirmations collection.
- Existing booking functionality must continue to work after the refactoring.
- Retrieving bookings must return the appropriate booking information.
- An empty bookings collection must return an empty bookings array rather than an error.
- Database errors must be handled appropriately by the model and API controllers.

### Routes

#### GET /api/bookings

Purpose: Return all bookings stored in the database.

Success:

- Status code: `200`
- Response body: an object containing a `bookings` array of booking objects.
- Each booking object must include the relevant booking and passenger information.
- If no bookings exist, return an empty `bookings` array.

Example response:

json

```json
{
  "bookings": [
    {
      "_id": "booking123",
      "passenger": {
        "name": "John Smith",
        "email": "john@example.com"
      },
      "createdAt": "2026-11-20T10:00:00.000Z"
    }
  ]
}
```

The example illustrates the response structure. Actual booking fields must follow the project's existing booking data structure.

Errors:

- `500` if an unexpected server or database error occurs.

### Model Functions

The following model functions will be implemented in:

`src/models/bookings.js`

These functions must use Mongoose and the new Bookings schema to query and modify the MongoDB database.

#### createBooking

Purpose: Create a new booking document in the MongoDB `bookings` collection.

Parameters:

- Booking information: Required. Contains all necessary booking details.
- Passenger information: Required. Contains the passenger data associated with the booking.

The function will:

- Receive the required booking information, including passenger data.
- Create a new booking document using the Bookings schema.
- Save the document to the MongoDB `bookings` collection.
- Return the newly created booking document.

Expected result:

- Returns the newly created booking document when successful.
- Returns or propagates an appropriate error if booking creation fails.
- Must not create documents in the old `confirmations` collection.

#### getAllBookings

Purpose: Retrieve all booking documents from the MongoDB `bookings` collection.

The function will:

- Query the bookings collection using Mongoose.
- Retrieve all booking documents.
- Return an array containing all bookings.

Expected result:

- Returns an array containing all bookings when bookings exist.
- Returns an empty array when no bookings exist.
- Handles database errors appropriately.

#### getBookingById

Purpose: Retrieve an individual booking using its unique ID.

Parameters:

- `bookingId`: Required. The unique identifier of the booking.

The function will:

- Receive a booking ID.
- Query the bookings collection using the booking ID.
- Return the matching booking document.

Expected result:

- Returns the matching booking document when found.
- Returns `null` or an equivalent empty result when no matching booking exists.
- Handles database errors appropriately.

### API Controllers

The following API controller function will be implemented in:

`src/controllers/bookings.js`

#### getAllBookings

Purpose: Retrieve all bookings and return them as a JSON response.

The function will:

- Call the `getAllBookings()` model function.
- Retrieve all booking documents from MongoDB.
- Return the bookings in a JSON response.
- Return status `200` when the request succeeds.
- Return an empty `bookings` array if no bookings exist.
- Handle database errors and return status `500`.

Expected response:

json

```json
{
  "bookings": []
}
```

Both the API controller and model functions should follow the existing API response conventions used by the Trips API and other existing APIs.

### Swagger Documentation

Swagger must document the Bookings API route.

The documentation must include:

- HTTP method and endpoint path.
- Endpoint description.
- Successful response format.
- Possible error status codes.
- JSON response schema.
- Booking object properties.
- Passenger information included in the booking response.

The endpoint must be testable through the Swagger interface.

The Swagger documentation must be added alongside the existing API documentation.

### Booking Controller Refactoring

The existing booking-related controller functions will be moved into:

`src/controllers/bookings.js`

The following functions must be moved and refactored.

#### processBookingRequest

Purpose: Process a user's booking request and create a new booking.

The function will:

- Retrieve the required booking information from the request.
- Retrieve passenger information required for the booking.
- Validate the required booking information using the existing application validation rules.
- Call the `createBooking()` model function to create a new booking document.
- Use the new Bookings schema and model.
- Preserve the existing booking request processing behavior.
- Handle successful booking creation appropriately.
- Handle validation errors and database errors appropriately.
- No longer use the old confirmations collection or confirmation model functions.

The function must preserve the existing booking workflow and ensure that booking information is saved to the new `bookings` collection.

#### bookingPage

Purpose: Render the existing booking page.

The function will:

- Retrieve any required information needed to render the booking page.
- Use the appropriate model functions from the new bookings model when booking information is required.
- Render the existing booking EJS page.
- Preserve the existing booking page functionality.
- No longer depend on the old confirmations model or collection.

Both functions must be exported from `src/controllers/bookings.js` and connected to their appropriate routes.

### API Routes

The Bookings API route will be added to:

`src/routes/api-routes.js`

Required route:

#### GET /api/bookings

Purpose: Retrieve all booking documents using the `getAllBookings` API controller function.

The route must:

- Use the HTTP GET method.
- Call the `getAllBookings` controller function.
- Return JSON responses.
- Be documented in Swagger.
- Be registered alongside the existing API routes.

The API routes and EJS routes must remain separate.

- API routes return JSON responses.
- EJS routes render HTML pages.

### EJS Routes and Controller Routing

The existing booking routes must be updated to use the new controller functions in `src/controllers/bookings.js`.

The routing logic must:

- Update the existing booking page route to use the new `bookingPage` controller.
- Update the existing booking submission route to use the new `processBookingRequest` controller.
- Ensure the routes reference the functions exported from `src/controllers/bookings.js`.
- Remove references to the old controller locations where appropriate.
- Preserve the existing booking URLs and functionality unless a change is required by the feature.

A new EJS route must also be created for the bookings administration page.

#### GET /bookings-admin

Purpose: Render the bookings administration page.

The route must:

- Use the new bookings EJS controller function.
- Render `src/views/bookings.ejs`.
- Allow administrators to view the list of bookings.
- Use client-side JavaScript to retrieve booking information through the Bookings API.

### Frontend: Bookings Administration Page

A new bookings administration page will be created at:

`src/views/bookings.ejs`

The page will use the web service hydration approach, following the existing trains page implementation as an example.

The page must not use EJS to iterate through booking records and render them directly.

Instead, client-side JavaScript will:

- Load the bookings administration page.
- Fetch all bookings from `/api/bookings` when the page loads.
- Parse the JSON response.
- Retrieve the `bookings` array.
- Dynamically populate the bookings list with the returned booking information.
- Display relevant booking details, including passenger information.
- Display any other booking information needed by administrators.
- Handle an empty bookings array appropriately.
- Display an appropriate message when no bookings exist.
- Handle API request errors appropriately.

The bookings list must be dynamically generated using client-side JavaScript.

The page must not use EJS loops to render booking records.

The implementation should follow the same general approach used by the existing trains page, including its client-side API request and dynamic content population pattern.

### EJS Controller: Bookings Administration Page

The new EJS controller function will be implemented in:

`src/controllers/bookings.js`

#### bookingsAdminPage

Purpose: Render the bookings administration page.

The function will:

- Render `src/views/bookings.ejs`.
- Pass any required static page information to the EJS template.
- Not retrieve all bookings from the database for server-side rendering.
- Not pass a bookings array to the EJS view.
- Allow client-side JavaScript to retrieve booking information from `/api/bookings`.

Booking information will instead be retrieved by the client-side JavaScript after the page loads.

### Collection and Code Refactoring

The existing `confirmations` collection and related code must be renamed or refactored to use `bookings`.

The refactoring must:

- Create the new Bookings schema.
- Create the new Bookings model.
- Update model imports and references.
- Update controller imports and references.
- Update database queries to use the bookings collection.
- Update booking creation logic to use `createBooking()`.
- Update booking retrieval logic to use the new model functions.
- Remove outdated references to the confirmations collection where appropriate.
- Ensure new booking documents are saved in the `bookings` collection.
- Ensure the application no longer relies on the old confirmations model for booking functionality.

Existing database records should be considered when changing the collection name. If existing confirmation records must remain available, a migration or collection rename strategy should be considered so that previously stored booking information is not unintentionally lost.

### Test Plan

The following checks will be performed to verify that the Bookings feature works correctly.

Schema Tests

- Create a booking with all required booking fields.
- Verify that passenger information is stored correctly.
- Verify that required booking fields are validated.
- Verify that booking documents are saved in the `bookings` collection.
- Verify that timestamps are automatically generated.
- Verify that the schema does not save new bookings to the old `confirmations` collection.

Model Tests

- Call `createBooking()` with valid booking and passenger information and verify that a new booking document is created.
- Verify that the created booking document contains the expected booking information.
- Verify that `createBooking()` handles invalid booking information appropriately.
- Call `getAllBookings()` and verify that all booking documents are returned.
- Call `getAllBookings()` when no bookings exist and verify that an empty array is returned.
- Call `getBookingById()` with an existing booking ID and verify that the correct booking is returned.
- Call `getBookingById()` with a nonexistent booking ID and verify that an empty result is returned.
- Verify that database errors are handled appropriately.

API Tests

- Send a GET request to `/api/bookings` and verify that all bookings are returned with status `200`.
- Verify that the response contains a `bookings` array.
- Verify that booking objects include the expected booking and passenger information.
- Send a GET request when no bookings exist and verify that an empty bookings array is returned.
- Verify that database errors return status `500`.
- Verify that Swagger documentation correctly describes the endpoint.
- Verify that the endpoint can be tested through the Swagger interface.

Booking Controller Tests

- Verify that `processBookingRequest` is implemented in `src/controllers/bookings.js`.
- Submit a valid booking request and verify that a booking is successfully created.
- Verify that passenger information is saved with the booking.
- Verify that booking information is saved using `createBooking()`.
- Verify that invalid booking requests are handled appropriately.
- Verify that database errors are handled appropriately.
- Verify that `bookingPage` is implemented in `src/controllers/bookings.js`.
- Verify that the existing booking page still renders successfully.
- Verify that existing booking functionality is preserved.

Frontend Tests

- Navigate to `/bookings-admin` and verify that the bookings administration page loads successfully.
- Verify that the page retrieves bookings from `/api/bookings`.
- Verify that the API response is parsed correctly.
- Verify that the bookings array is dynamically displayed.
- Verify that passenger information is displayed correctly.
- Verify that other relevant booking information is displayed.
- Verify that an appropriate message appears when no bookings exist.
- Verify that API errors are handled appropriately.
- Verify that booking records are not rendered using EJS loops.
- Verify that the page follows the client-side hydration approach used by the trains page.

EJS Controller and Routing Tests

- Verify that the existing booking page route uses the new `bookingPage` controller.
- Verify that the booking submission route uses the new `processBookingRequest` controller.
- Verify that both functions are exported from `src/controllers/bookings.js`.
- Verify that `/bookings-admin` is registered as an EJS route.
- Verify that `/bookings-admin` renders `src/views/bookings.ejs`.
- Verify that the bookings administration controller does not retrieve bookings for server-side rendering.
- Verify that the bookings API route is registered in `src/routes/api-routes.js`.
- Verify that API routes and EJS routes remain separate.

Collection Refactoring Tests

- Verify that new booking documents are saved in the `bookings` collection.
- Verify that booking creation no longer uses the `confirmations` collection.
- Verify that related imports and references have been updated.
- Verify that the application does not depend on outdated confirmation model functions.
- Verify that existing booking functionality continues to work after the collection refactoring.
- Verify that existing booking records are preserved or migrated if required.

### Deployment Expectations

After implementation, the Bookings API, booking functionality, and bookings administration page must work locally and from the deployed Render application.

The deployed API endpoint must be accessible through the application.

The deployed Swagger page at `/api-docs` must allow users to view and test the Bookings API endpoint.

The deployed bookings administration page at `/bookings-admin` must successfully retrieve booking information through the API and dynamically populate the bookings list.

The existing booking process must continue to work, with newly created booking documents stored in the MongoDB `bookings` collection instead of `confirmations`.

The implementation must preserve existing passenger and booking information while ensuring that all new booking functionality uses the new Bookings schema and model.