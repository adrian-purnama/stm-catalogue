/**
 * Session token storage utility
 * Manages session tokens for catalogue access
 */

const STORAGE_KEY = 'catalogue_session_token';

/**
 * Get session token from localStorage or URL query parameter
 * @returns {string|null} Session token or null if not found
 */
export function getSessionToken() {
  // First check URL query parameter (for initial access)
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('session');
    
    if (urlToken) {
      // Store in localStorage for future use
      setSessionToken(urlToken);
      // Clean up URL (remove session param)
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('session');
      window.history.replaceState({}, '', newUrl);
      return urlToken;
    }
    
    // Check localStorage
    return localStorage.getItem(STORAGE_KEY);
  }
  
  return null;
}

/**
 * Set session token in localStorage
 * @param {string} token - Session token to store
 */
export function setSessionToken(token) {
  if (typeof window !== 'undefined' && token) {
    localStorage.setItem(STORAGE_KEY, token);
  }
}

/**
 * Clear session token from localStorage
 */
export function clearSessionToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Check if session token exists
 * @returns {boolean} True if token exists
 */
export function hasSessionToken() {
  return getSessionToken() !== null;
}




















