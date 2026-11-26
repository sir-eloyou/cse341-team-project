
# User Dashboard and Navigation Specification - Version 1

## Feature Set 2: User Dashboard and Navigation

### Goal

Create a new standard user dashboard and update the application's navigation system to improve user experience and accessibility.

The standard user dashboard will allow authenticated users to view their personal booking information and navigate to other relevant application pages.

The dashboard must display a welcome message using the logged-in user's display name and dynamically retrieve bookings where the user's email matches the email address of at least one passenger.

The application header must also be updated to provide appropriate navigation links depending on the user's authentication status and role.

The login process must support role-based redirection so that administrators are automatically redirected to the admin dashboard, while all other users are redirected to the standard user dashboard.

The implementation must preserve the existing authentication, booking, and administrator functionality.

---

### Feature Requirements

The feature set consists of the following requirements:

1. Create a new standard user dashboard.
2. Update the header to display Register and Login links only to users who are not signed in.
3. Update the header to display a Logout link only to users who are signed in.
4. Update the header to display a Dashboard link only to users who are signed in, with the destination determined by the user's role.
5. Update the login process to redirect users according to their role.

---

### Standard User Dashboard

A new dashboard page must be created for standard users.

The dashboard must:

- Display a welcome message containing the logged-in user's display name.
- Display all bookings associated with the logged-in user's email address.
- Retrieve booking information dynamically through a client-side JavaScript API request.
- Display relevant booking information.
- Provide a link to the booking administration page.
- Provide a link to the user administration page.
- Use Bootstrap for responsive layout and styling.

The dashboard must use EJS to render the page.

Booking records must not be rendered using EJS loops. Instead, client-side JavaScript must retrieve booking information through the existing API.

#### Welcome Message

The dashboard must display a personalized welcome message.

Example:

`Welcome, John!`

The display name must be retrieved from the authenticated user's session and passed to the EJS template.

#### My Bookings

The dashboard must display bookings where the logged-in user's email matches the email address of at least one passenger.

The implementation must:

- Retrieve the authenticated user's email from the session.
- Send a client-side GET request to the User Bookings API.
- Parse the returned JSON response.
- Retrieve the matching booking records.
- Dynamically generate booking cards.
- Display the relevant booking details.

Each booking card should display:

- Booking ID or ticket number.
- Trip name.
- Departure time.
- Arrival time.
- Travel day.
- Number of passengers.
- Ticket class.
- Booking date.

The dashboard must support bookings containing multiple passengers.

#### Empty Bookings Message

If the user does not have any matching bookings, display:

`You have no bookings yet.`

The implementation must:

- Check whether the returned bookings array is empty.
- Display the empty bookings message.
- Avoid generating empty booking cards.
- Ensure that the message is not removed when the booking container is updated.
- Hide the empty bookings message when matching bookings exist.

#### Quick Links

The dashboard must include a Quick Links section.

The following navigation links must be provided:

**Booking Admin**

- Link to the existing booking administration page.
- Purpose: Allow navigation to the booking administration page.

**User Admin**

- Link to the existing user administration page.
- Purpose: Allow navigation to the user administration page.

The links must use the application's registered routes.

The Quick Links section should use Bootstrap cards or another appropriate Bootstrap navigation layout.

Displaying these links must not grant administrator privileges or bypass existing route authorization.

---

### User Bookings API Integration

The dashboard must use the existing User Bookings API to retrieve personal booking information.

#### GET /api/user-bookings

Purpose: Retrieve all bookings associated with the currently authenticated user.

The API must:

- Identify the logged-in user through the existing authentication session.
- Retrieve the user's email address from the session.
- Retrieve booking documents from the existing bookings model.
- Filter bookings by checking the passenger email addresses.
- Include bookings where at least one passenger email matches the logged-in user's email.
- Retrieve associated trip information.
- Retrieve associated schedule information.
- Return matching bookings as JSON.
- Return an empty array when no matching bookings exist.
- Handle authentication and server errors appropriately.

Email comparisons should ignore case differences and leading or trailing whitespace.

The API must not rely on an email address supplied by the client to identify the authenticated user.

#### Successful Response

Status code: `200`

The response must contain:

- A success message.
- The number of matching bookings.
- An array containing the matching booking records.

#### Empty Response

Status code: `200`

Example:

```
{
  "message": "There's no bookings",
  "counts": 0,
  "data": []
}
```

#### Error Responses

- `401` if the user is not authenticated.
- `500` if an unexpected server or database error occurs.

---

### Header Navigation Updates

The existing application header must be updated to display navigation links based on the user's authentication status and role.

The header must use the existing user session information.

The following navigation behavior is required.

#### 1. Register and Login Links

Register and Login links must only be displayed when the user is not signed in.

When the user is not authenticated, the header must display:

- Register
- Login

The links must navigate to their existing application routes.

When the user is authenticated, these links must not be displayed.

#### 2. Logout Link

The Logout link must only be displayed when the user is signed in.

When the user is authenticated:

- Display the Logout link.
- The link must navigate to the existing logout route.
- The logout process must clear or destroy the user's authenticated session.

When the user is not authenticated, the Logout link must not be displayed.

#### 3. Dashboard Link

The Dashboard link must only be displayed when the user is signed in.

The destination must depend on the authenticated user's role.

For administrators:

- Display the Dashboard link.
- Link destination: `/admin-dashboard`.

For all other authenticated users:

- Display the Dashboard link.
- Link destination: `/user-dashboard`.

The header must not display the Dashboard link to unauthenticated users.

#### Expected Header Navigation

| User Status   | Register | Login   | Logout  | Dashboard          |
| ------------- | -------- | ------- | ------- | ------------------ |
| Not signed in | Visible  | Visible | Hidden  | Hidden             |
| Standard user | Hidden   | Hidden  | Visible | `/user-dashboard`  |
| Admin user    | Hidden   | Hidden  | Visible | `/admin-dashboard` |

---

### EJS Header Implementation

The existing header partial must be updated.

The implementation must use EJS conditional statements to determine which navigation links are displayed.

The header must:

- Check whether the user is authenticated.
- Display Register and Login when no authenticated user exists.
- Display Logout when an authenticated user exists.
- Display Dashboard when an authenticated user exists.
- Check the user's role to determine the dashboard destination.
- Display the admin dashboard link for administrators.
- Display the standard user dashboard link for all other authenticated users.

The implementation must use valid EJS syntax and preserve the existing header layout and styling.

Example conditional logic:

```
<% if (user) { %>

    <% if (user.role === 'admin') { %>
        <li>
            <a href="/admin-dashboard">Dashboard</a>
        </li>
    <% } else { %>
        <li>
            <a href="/user-dashboard">Dashboard</a>
        </li>
    <% } %>

    <li>
        <a href="/logout">Logout</a>
    </li>

<% } else { %>

    <li>
        <a href="/login">Login</a>
    </li>

    <li>
        <a href="/register">Register</a>
    </li>

<% } %>
```

The actual implementation must follow the application's existing EJS header structure and session conventions.

---

### User Dashboard Controller

The standard user dashboard controller must be implemented in the appropriate controller file.

#### userDashboardPage

Purpose: Render the standard user dashboard.

The function must:

- Verify that the user is authenticated.
- Retrieve the authenticated user's session information.
- Retrieve the user's display name.
- Render the standard user dashboard EJS page.
- Pass the necessary user information to the EJS template.
- Not retrieve booking records for server-side rendering.
- Allow client-side JavaScript to retrieve booking information through the User Bookings API.

Unauthenticated users must be redirected to the login page.

The controller must preserve the existing authentication and authorization structure.

---

### EJS Routes and Controller Routing

A new EJS route must be created for the standard user dashboard.

#### GET /user-dashboard

Purpose: Render the standard user dashboard.

The route must:

- Use the `userDashboardPage` controller function.
- Verify that the user is authenticated.
- Render the standard user dashboard EJS page.
- Pass the authenticated user's information to the EJS template.

The existing header partial must also be updated to support the new navigation behavior.

The existing API routes and EJS routes must remain separate.

---

### Frontend: Standard User Dashboard

A new EJS page must be created for the standard user dashboard.

The page must follow the application's existing EJS layout conventions and use Bootstrap for responsive styling.

The page must include:

- A welcome message.
- A My Bookings section.
- Dynamically generated booking cards.
- An empty bookings message.
- A Quick Links section.

The frontend must follow the web service hydration approach.

Client-side JavaScript must:

- Wait for the page to load.
- Fetch booking information from `/api/user-bookings`.
- Check whether the API request was successful.
- Parse the JSON response.
- Retrieve the booking data array.
- Generate booking cards dynamically.
- Populate the booking information.
- Display the empty bookings message when no bookings exist.
- Handle API request errors appropriately.

The page must not use EJS loops to generate booking records.

---

### Login Process and Role-Based Redirection

The existing login process must be updated to support automatic dashboard redirection based on the authenticated user's role.

After successful authentication, the application must check the user's role.

#### Administrator Login

When the authenticated user has the role:

`admin`

The application must redirect the user to:

`/admin-dashboard`

#### Standard User Login

When the authenticated user has any role other than `admin`, the application must redirect the user to:

`/user-dashboard`

The login process must:

- Validate the user's login credentials using the existing authentication logic.
- Retrieve the authenticated user's information.
- Store the necessary user information in the session.
- Include the user's ID, display name, email address, and role in the session.
- Save the session before performing the redirect.
- Redirect administrators to the admin dashboard.
- Redirect all other authenticated users to the standard user dashboard.
- Preserve the existing password validation and authentication behavior.

The implementation must not break the existing login functionality.

---

### Authentication and Authorization

The application must preserve its existing authentication and authorization structure.

The following rules must be enforced:

- Unauthenticated users cannot access the standard user dashboard.
- Authenticated users can access the appropriate dashboard.
- Administrators must be redirected to the admin dashboard after login.
- Standard users must be redirected to the standard user dashboard after login.
- Standard users must not gain administrator privileges.
- Administrator-only pages must remain protected by role-based authorization.
- The User Bookings API must use the authenticated user's session email.
- Users must not be able to retrieve another user's bookings by modifying client-side requests.
- Navigation links must reflect the user's authentication status and role.

---

### Test Plan

The following checks will be performed to verify that the User Dashboard and Navigation feature works correctly.

#### Standard User Dashboard Tests

- Navigate to `/user-dashboard` while authenticated as a standard user.
- Verify that the dashboard loads successfully.
- Verify that the welcome message displays the correct user's display name.
- Verify that the dashboard uses the correct Bootstrap layout.
- Verify that the My Bookings section is displayed.
- Verify that matching booking records are dynamically populated.
- Verify that the empty bookings message appears when the user has no bookings.
- Verify that the empty bookings message is hidden when bookings exist.
- Verify that the Quick Links section is displayed.
- Verify that the Booking Admin link navigates to the correct booking administration page.
- Verify that the User Admin link navigates to the correct user administration page.

#### User Bookings API Tests

- Send a GET request to `/api/user-bookings` while authenticated.
- Verify that the API returns status `200`.
- Verify that the authenticated user's email is retrieved from the session.
- Verify that bookings containing a matching passenger email are returned.
- Verify that bookings without a matching passenger email are excluded.
- Verify that bookings containing multiple passengers are handled correctly.
- Verify that email comparisons ignore case and surrounding whitespace.
- Verify that trip information is included.
- Verify that schedule information is included.
- Verify that an empty result returns an empty data array.
- Verify that unauthenticated requests return status `401`.
- Verify that unexpected server errors return status `500`.

#### Header Navigation Tests

**Unauthenticated Users**

- Verify that the Register link is visible.
- Verify that the Login link is visible.
- Verify that the Logout link is hidden.
- Verify that the Dashboard link is hidden.

**Authenticated Standard Users**

- Verify that the Register link is hidden.
- Verify that the Login link is hidden.
- Verify that the Logout link is visible.
- Verify that the Dashboard link is visible.
- Verify that the Dashboard link points to `/user-dashboard`.

**Authenticated Admin Users**

- Verify that the Register link is hidden.
- Verify that the Login link is hidden.
- Verify that the Logout link is visible.
- Verify that the Dashboard link is visible.
- Verify that the Dashboard link points to `/admin-dashboard`.

#### Login and Redirection Tests

- Log in using valid administrator credentials.
- Verify that the administrator is redirected to `/admin-dashboard`.
- Log in using valid standard user credentials.
- Verify that the standard user is redirected to `/user-dashboard`.
- Verify that the user session contains the correct user ID.
- Verify that the user session contains the correct display name.
- Verify that the user session contains the correct email address.
- Verify that the user session contains the correct role.
- Verify that the session is saved before redirection.
- Verify that invalid login credentials are handled using the existing authentication behavior.

#### Authorization Tests

- Verify that unauthenticated users cannot access `/user-dashboard`.
- Verify that standard users cannot access administrator-only pages.
- Verify that administrators can access their authorized admin pages.
- Verify that users cannot retrieve another user's bookings.
- Verify that displaying navigation links does not bypass route authorization.
- Verify that logout successfully ends the authenticated session.

---

### Deployment Expectations

After implementation, the User Dashboard and Navigation feature must work locally and in the deployed Render application.

The following must be verified:

- The standard user dashboard loads successfully at `/user-dashboard`.
- The welcome message displays the correct user's display name.
- User bookings are retrieved dynamically through `/api/user-bookings`.
- Only bookings associated with the authenticated user's email are displayed.
- The empty bookings message appears when no matching bookings exist.
- The Quick Links navigate to their corresponding pages.
- Register and Login links appear only for unauthenticated users.
- Logout appears only for authenticated users.
- Dashboard navigation appears only for authenticated users.
- Administrators are directed to `/admin-dashboard`.
- Standard users are directed to `/user-dashboard`.
- Authentication and authorization restrictions remain functional.
- Existing application functionality is preserved.

The implementation must provide a consistent navigation experience while ensuring that users can access only the pages and information permitted by their authentication status and role.

