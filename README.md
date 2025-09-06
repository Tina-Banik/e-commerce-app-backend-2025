**e-commerce-app-backend-2025** 
This is the backend for an e-commerce application, a robust and secure server built with Node.js and Express.js. It's designed to manage user authentication, product listings, and order processing platrform.
**Key Features and Technologies**
The backend is built with a powerful set of technologies to ensure high performance and security.
**Node.js & Express.js:** The core of the application, providing a fast and efficient server environment.
**MongoDB:** The database is powered by MongoDB, a flexible NoSQL database, managed through Mongoose, an Object Data Modeling (ODM) library.
**Authentication & Security:**
**Role-Based Authentication:** The system distinguishes between Admin and User roles, providing different levels of access and functionality.
**bcryptjs:** Used for securely hashing and salting user passwords.
**jsonwebtoken:** Implements JSON Web Tokens (JWT) for secure authentication.
**Token Blacklisting:** A sophisticated token blacklisting system is implemented for secure logout. When a user logs out, their refresh and access tokens are added to a blacklist, effectively invalidating them.
**Refresh Token Endpoint:** The POST /refresh-access-token endpoint is protected by a series of checks (checkBlacklists, verifyRefreshToken) to ensure that only a valid, non-blacklisted refresh token can be used to generate a new access token.
**Middleware:**
**logout.middleware.js**: A dedicated middleware is used to handle the logout process by decoding the refresh token and adding it to the blacklist.
**cors:** Enables cross-origin resource sharing, allowing the frontend to securely communicate with this backend.
**cookie-parser:** Parses cookies attached to incoming requests.

**File Uploads:**
multer: Handles multi-part form data, primarily used for uploading food item images. When an admin deletes a food item, the associated image is also automatically deleted from the server's folder, ensuring data hygiene.
**Admin APIs**
Admins have full control over the application's data.
**User APIs**
Users can interact with the food ordering system.
