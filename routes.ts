/**
 * An array of routes that are accessible to the public
 * These routes don't require authentication
 * @type {string[]}
 */
export const publicRoutes = ["/", "/home", "/payment/success", "/payment/error", "/payment/unfinish", "/new-verification"];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = ["/login", "/register"];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */

export const apiAuthPrefix = "/api";

/**
 * The default redirect path after logging in
 * @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT = "/home";

/**
 * An array of routes that are not accessible before email verified
 * There routes will redirect user to profile for verification
 */

export const verifiedUserRoutes = ["/cart", "/product/", "/history"];
