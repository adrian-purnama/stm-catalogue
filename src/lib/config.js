/**
 * Application Configuration
 * Centralized configuration using environment variables
 * 
 * Next.js automatically loads .env files, but dotenv is available
 * for additional configuration if needed.
 */

// API URL - accessible on both client and server
// NEXT_PUBLIC_ prefix makes it available in the browser
export const API_URL = 'https://be-stm-portal.stm-asb.co.id/api';

// Other environment variables can be added here as needed
export const config = {
  apiUrl: API_URL,
};

