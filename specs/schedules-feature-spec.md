# Schedules API Spec - Version 1

## Feature 2: Trip Schedules API and Frontend Hydration

### Goal

Create a Schedules API that allows users to retrieve all schedules associated with a specific trip and retrieve schedules for a specific month.

Schedule information will be stored in MongoDB using a Mongoose schema.

The API must provide JSON responses with appropriate HTTP status codes and must be documented in Swagger.

The trip details page will use the web service hydration approach for schedules. Instead of using EJS to render schedule records, client-side JavaScript will fetch schedule information from the API and dynamically populate the schedules component.

When a user selects a different month, the client-side JavaScript must request the corresponding schedules from the API and update the displayed schedules without reloading the page.

The existing trip details EJS controller function will also be updated. It will no longer retrieve schedules because schedule information will be populated later through the API.

### Data Model

Schedule documents will be stored in the `schedules` collection.

Required schedule fields should follow the existing schedule data structure in the project.

The schedule schema must:

- Use Mongoose to define the schedule document structure.
- Include a field that associates the schedule with a specific trip.
- Include the date of the scheduled activity.
- Include the necessary information required to display a schedule on the trip details page.
- Use Mongoose timestamps to automatically generate `createdAt` and `updatedAt` fields.

The trip association must reference the trip's custom string ID used by the Trips API.

### Validation Rules

- Each schedule must be associated with a valid trip ID.
- All required schedule fields must be provided.
- The schedule date must be a valid date.
- The month filter must accept only integer values from 1 to 12.
- Schedule documents must be retrievable using their associated trip ID.
- Month filtering must use the month of the schedule date.
- Schedules must not be returned if they belong to a different trip.
- An empty result must return an empty schedules array rather than an error.

### Routes

#### GET /api/trips/:id/schedules

Purpose: Return all schedules associated with a specific trip.

Success:

- Status code: `200`
- Response body: an object containing a `schedules` array of schedule objects.
- If no schedules exist for the trip, return an empty `schedules` array.

Example response:

Errors:

- `404` if no trip exists with the provided ID, if trip existence is validated.
- `500` if an unexpected server or database error occurs.

#### GET /api/trips/:id/schedules?month=:month

Purpose: Return schedules associated with a specific trip filtered by month.

Success:

- Status code: `200`
- Response body: an object containing a `schedules` array of schedule objects.
- Only schedules belonging to the specified trip and month must be returned.
- If no schedules match the selected month, return an empty `schedules` array.

Example request:

GET /api/trips/mountain-express/schedules?month=11

Example response:

Errors:

- `400` if the month parameter is invalid or outside the range of 1 to 12.
- `404` if no trip exists with the provided ID, if trip existence is validated.
- `500` if an unexpected server or database error occurs.

### Model Functions

The following model function will be implemented in `src/models/schedules.js` using Mongoose and the Schedules schema.

#### getSchedulesByTripId(tripId, month)

Purpose: Retrieve schedules associated with a specific trip, optionally filtered by month.

Parameters:

- `tripId`: Required. The custom string ID of the trip.
- `month`: Optional. An integer representing the month (1–12).

Expected result:

- Returns an array containing all schedules associated with the specified trip when no month is provided.
- Returns only schedules associated with the specified trip and month when a month is provided.
- Returns an empty array if no matching schedules exist.

The function must query the MongoDB `schedules` collection using Mongoose.

### API Controllers

The following API controller functions will be implemented in `src/controllers/schedules.js`.

#### getSchedulesForTrip

Purpose: Retrieve all schedules associated with a specific trip and return them as a JSON response.

The function will:

- Retrieve the trip ID from the request parameters.
- Call `getSchedulesByTripId()` without a month parameter.
- Return the schedules in a JSON response.
- Return status `200` when the request succeeds.
- Handle database errors and return status `500`.

#### getSchedulesForTripAndMonth

Purpose: Retrieve schedules associated with a specific trip for a selected month.

The function will:

- Retrieve the trip ID from the request parameters.
- Retrieve the month number from the request query parameters.
- Validate that the month is an integer between 1 and 12.
- Call `getSchedulesByTripId()` with the trip ID and month.
- Return the filtered schedules in a JSON response.
- Return status `400` if the month parameter is invalid.
- Handle database errors and return status `500`.

Both controllers should follow the existing API response conventions used by the Trips API.

### Swagger Documentation

Swagger must document both Schedules API routes.

The documentation must include:

- HTTP methods and endpoint paths.
- Endpoint descriptions.
- Required trip ID path parameter.
- Optional or required month query parameter, depending on the endpoint.
- Successful response formats.
- Possible error status codes.
- JSON response schemas.

The endpoints must be testable through the Swagger interface.

### Frontend: Trip Details Page

The trip details page at `src/view/trips/details.ejs` will use the web service hydration approach for schedules.

The page must no longer use EJS to render schedule records.

Instead, client-side JavaScript will:

- Retrieve the trip ID from the rendered page.
- Fetch all schedules from `/api/trips/:id/schedules` when the page loads.
- Parse the JSON response.
- Retrieve the schedules array.
- Dynamically populate the schedules component with the returned schedule information.
- Display the schedule title, description, date, and other relevant schedule details.
- Retain the existing month selection component.
- Listen for changes to the selected month.
- Fetch the schedules for the selected month using `/api/trips/:id/schedules?month=:month`.
- Update the schedules component with the newly retrieved schedule information.
- Display an appropriate message when no schedules are available for the selected month.
- Handle API request errors appropriately.

The schedules component must update dynamically without requiring a full-page reload.

### EJS Controller Refactoring

The existing trip details EJS controller function will be updated.

#### detailsPageHandler

Purpose: Render the details page for an individual trip.

The function will:

- Retrieve the trip ID from the request parameters.
- Use the existing `getTripById()` model function to retrieve the trip.
- Pass the trip information and other required page data to `details.ejs`.
- Return a `404` response if the trip does not exist.
- No longer retrieve schedules from the database.
- No longer pass schedules to the EJS view.

Schedule information will instead be retrieved by the client-side JavaScript through the Schedules API after the page loads.

### API Routes

The Schedules API routes will be added to `src/routes/api-routes.js`.

Required routes:

#### GET /api/trips/:id/schedules

Purpose: Retrieve all schedules associated with the selected trip using `getSchedulesForTrip`.

#### GET /api/trips/:id/schedules?month=:month

Purpose: Retrieve schedules associated with the selected trip for a specific month using `getSchedulesForTripAndMonth`.

Both routes must be registered in the existing API routes file.

The API routes and EJS routes must remain separate. API routes return JSON responses, while EJS routes render HTML pages.

### Test Plan

The following checks will be performed to verify that the Schedules feature works correctly.

Schema Tests

- Create a schedule with all required fields.
- Verify that a schedule without a trip ID is rejected.
- Verify that a schedule without a valid date is rejected.
- Verify that required schedule fields are validated.
- Verify that timestamps are automatically generated.

Model Tests

- Call `getSchedulesByTripId()` with an existing trip ID and verify that all associated schedules are returned.
- Call `getSchedulesByTripId()` with a trip ID that has no schedules and verify that an empty array is returned.
- Call `getSchedulesByTripId()` with an existing trip ID and month number and verify that only schedules from that month are returned.
- Verify that schedules belonging to other trips are not returned.
- Verify that month filtering correctly handles dates across different months.
- Verify that database errors are handled appropriately.

API Tests

- Send a GET request to `/api/trips/:id/schedules` using an existing trip ID and verify that all associated schedules are returned with status `200`.
- Send a GET request to `/api/trips/:id/schedules?month=11` and verify that only November schedules are returned with status `200`.
- Send a GET request using a trip ID with no schedules and verify that an empty schedules array is returned.
- Send a GET request with an invalid month and verify that status `400` is returned.
- Send a GET request with a month below 1 and verify that status `400` is returned.
- Send a GET request with a month above 12 and verify that status `400` is returned.
- Verify that schedules from another trip are never included.
- Verify that database errors return status `500`.
- Verify that Swagger documentation correctly describes both endpoints.

Frontend Tests

- Open the trip details page and verify that it loads successfully.
- Verify that schedules are retrieved from `/api/trips/:id/schedules`.
- Verify that schedule information is dynamically displayed.
- Verify that the month selection component works.
- Select a different month and verify that a new API request is sent.
- Verify that the API request includes the selected month.
- Verify that the schedules component updates without reloading the page.
- Verify that only schedules from the selected month are displayed.
- Verify that an appropriate message appears when no schedules are available.
- Verify that API errors are handled appropriately.
- Verify that schedules are no longer rendered using EJS loops.

EJS Controller and Routing Tests

- Verify that the trip details page still renders successfully.
- Verify that the correct trip information is passed to `details.ejs`.
- Verify that the details page controller does not retrieve schedules.
- Verify that the details page controller does not pass schedules to the EJS view.
- Verify that schedules are populated through the Schedules API.
- Verify that the API routes are defined in `src/routes/api-routes.js`.

### Deployment Expectations

After implementation, the Schedules API and trip details page must work locally and from the deployed Render application.

The deployed API endpoints must be accessible through the application.

The deployed Swagger page at `/api-docs` must allow users to view and test both Schedules API routes from the browser.

The deployed trip details page must successfully retrieve schedules through the API and dynamically update the schedules component whenever a user selects a different month.