
# Trips API Spec - Version 1

## Feature 1: Scenic Train Trips API and Web Service Hydration

### Goal
Create a Trips API that allows users to retrieve all available scenic train trips and retrieve an individual trip using its custom ID. Trip information will be stored in MongoDB using a Mongoose schema.

The API must provide JSON responses with appropriate HTTP status codes and must be documented in Swagger.

The trips listing page will use the web service hydration approach. Instead of using EJS to render trip records, client-side JavaScript will fetch trip information from the API and dynamically populate the page.

The existing EJS controller functions for the trips listing and details pages will also be refactored into the trips controller, and their routes will be moved to the EJS routes file.

### Data Model
Trip documents will be stored in the `trips` collection.

Required trip fields:
- `id`: string, required, unique custom ID for each trip
- `name`: string, required, unique name of the trip
- `description`: string, required, description of the scenic train trip
- `region`: string, required, geographic region of the trip
- `startStation`: string, required, starting station of the trip
- `endStation`: string, required, destination station of the trip
- `duration`: string, required, estimated duration of the trip
- `distance`: number, required, distance of the trip in kilometers
- `highlights`: array of strings, required, notable attractions or features of the trip
- `bestSeason`: string, required, recommended travel season
- `operatingMonths`: array of numbers, required, months when the trip operates
- `imageUrl`: string, required, URL of the trip image

The trip schema will also use Mongoose timestamps to automatically generate `createdAt` and `updatedAt` fields.

### Validation Rules
- The `id` field must be unique.
- The `name` field must be unique.
- All required fields must be provided.
- `distance` must be a non-negative number.
- `highlights` must contain at least one item.
- `bestSeason` must be one of the following values: `summer`, `autumn`, `spring`, or `winter`.
- `operatingMonths` must contain valid month numbers from 1 to 12.
- Duplicate operating months are not allowed.

Trips will use custom string IDs instead of MongoDB `_id` values for route parameters.

### Routes

#### GET /api/trips
Purpose: Return all available scenic train trips.

Success:
- Status code: `200`
- Response body: an object containing a `trips` array of trip objects.
- If no trips exist, return an empty `trips` array.

Example response:

    {
      "trips": [
        {
          "id": "mountain-express",
          "name": "Mountain Express",
          "description": "A scenic train journey through the mountains.",
          "region": "north",
          "startStation": "Central Station",
          "endStation": "Mountain Station",
          "duration": "3 hours",
          "distance": 120,
          "highlights": ["Mountain Views", "Scenic Valleys"],
          "bestSeason": "summer",
          "operatingMonths": [3, 4, 5, 6],
          "imageUrl": "https://example.com/train.jpg"
        }
      ]
    }

Errors:
- `500` if an unexpected server or database error occurs.

#### GET /api/trips/:id
Purpose: Return one scenic train trip by its custom ID.

Success:
- Status code: `200`
- Response body: the matching trip object.

Example response:

    {
      "id": "mountain-express",
      "name": "Mountain Express",
      "description": "A scenic train journey through the mountains.",
      "region": "north",
      "startStation": "Central Station",
      "endStation": "Mountain Station",
      "duration": "3 hours",
      "distance": 120,
      "highlights": ["Mountain Views", "Scenic Valleys"],
      "bestSeason": "summer",
      "operatingMonths": [3, 4, 5, 6],
      "imageUrl": "https://example.com/train.jpg"
    }

Errors:
- `404` if no trip exists with that ID.
- `500` if an unexpected server or database error occurs.

### Model Functions
The following model functions will be implemented in `src/models/trips.js` using Mongoose and the Trips schema.

#### getAllTrips()
Purpose: Retrieve all trip documents from the `trips` collection.

Expected result:
- Returns an array containing all trip documents.
- Returns an empty array if no trips exist.

#### getTripById(tripId)
Purpose: Retrieve one trip using its custom string ID.

Expected result:
- Returns the matching trip object.
- Returns `null` if no trip exists with the provided ID.

### API Controllers
The following API controller functions will be implemented in `src/controllers/trips.js`.

#### getAllTrips
Purpose: Call the `getAllTrips()` model function and return all trips as a JSON response.

#### getTripById
Purpose: Retrieve the trip ID from the request parameters, call the `getTripById()` model function, and return the matching trip as a JSON response.

Both controllers must handle database errors and return the appropriate HTTP status codes.

### Swagger Documentation
Swagger must document both Trips API routes.

The documentation must include:
- HTTP methods and endpoint paths.
- Endpoint descriptions.
- Required path parameters.
- Successful response formats.
- Possible error status codes.
- JSON response schemas.

The endpoints must be testable through the Swagger interface.

### Frontend: Trips Listing Page
The trips listing page at `src/views/trips/list.ejs` will use the web service hydration approach.

The page must no longer use EJS loops to render trip records.

Instead, client-side JavaScript will:
- Fetch trip information from `/api/trips`.
- Parse the JSON response.
- Retrieve the trips array.
- Clone the trip card HTML template.
- Populate each card with the corresponding trip information.
- Display the generated trip cards in the trips listing container.
- Display trip highlights dynamically.
- Provide a link to the details page for each trip.

The page will also retain the region and season filter dropdowns.

### EJS Controller Refactoring
The existing EJS controller functions will be moved into `src/controllers/trips.js`.

#### detailsPageHandler
Purpose: Render the details page for an individual trip.

The function will:
- Retrieve the trip ID from the request parameters.
- Use the `getTripById()` model function to retrieve the trip.
- Retrieve the schedules associated with the selected trip.
- Pass the trip information and schedules to `details.ejs`.
- Return a `404` response if the trip does not exist.

#### listPageHandler
Purpose: Render the trips listing page.

The function will:
- Retrieve available regions from the database.
- Retrieve available seasons from the database.
- Pass the page title, regions, and seasons to `list.ejs`.

This function must not retrieve all trip records because the trips listing page will retrieve them dynamically through the API.

### EJS Routes
The trips EJS routes will be moved to `src/routes/ejs-routes.js`.

Required routes:

#### GET /trips
Purpose: Render the scenic train trips listing page using `listPageHandler`.

#### GET /trips/:tripId
Purpose: Render the details page of the selected trip using `detailsPageHandler`.

The API routes and EJS routes must remain separate. API routes return JSON responses, while EJS routes render HTML pages.

### Test Plan

The following checks will be performed to verify that the Trips feature works correctly.

**Schema Tests**
- Create a trip with all required fields.
- Verify that a trip without an ID is rejected.
- Verify that duplicate trip IDs are rejected.
- Verify that duplicate trip names are rejected.
- Verify that invalid seasons are rejected.
- Verify that invalid operating months are rejected.
- Verify that negative distances are rejected.
- Verify that trips without highlights are rejected.

**Model Tests**
- Call `getAllTrips()` and verify that all trips are returned.
- Call `getAllTrips()` when no trips exist and verify that an empty array is returned.
- Call `getTripById()` with an existing ID and verify that the correct trip is returned.
- Call `getTripById()` with a nonexistent ID and verify that `null` is returned.

**API Tests**
- Send a GET request to `/api/trips` and verify that all trips are returned with status `200`.
- Send a GET request to `/api/trips/:id` using an existing ID and verify that the correct trip is returned with status `200`.
- Send a GET request using a nonexistent ID and verify that status `404` is returned.
- Verify that database errors return status `500`.
- Verify that an empty trips collection returns an empty array.

**Frontend Tests**
- Open the trips listing page and verify that it loads successfully.
- Verify that trip information is retrieved from `/api/trips`.
- Verify that trip cards are dynamically generated.
- Verify that trip information appears correctly in each card.
- Verify that the region and season filters work.
- Verify that the View Details link opens the correct trip.
- Verify that the listing page does not use EJS loops to render trip records.

**EJS Controller and Routing Tests**
- Verify that `/trips` renders the listing page.
- Verify that `/trips/:tripId` renders the correct details page.
- Verify that the details page retrieves trip information through the model function.
- Verify that the listing page controller does not retrieve all trip records.
- Verify that both EJS controller functions are located in `src/controllers/trips.js`.
- Verify that both EJS routes are defined in `src/routes/ejs-routes.js`.

### Deployment Expectations
After implementation, the Trips API and frontend pages must work locally and from the deployed Render application.

The deployed API endpoints must be accessible through the application.

The deployed Swagger page at `/api-docs` must allow users to view and test both Trips API routes from the browser.
