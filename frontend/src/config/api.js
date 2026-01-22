/**
 * API Configuration
 * 
 * In development (local), it defaults to http://localhost:8000
 * In production (Vercel), it uses the VITE_API_URL environment variable.
 */

// Removing trailing slash if present to avoid double slashes
const cleanUrl = (url) => url.replace(/\/$/, '');

// For Vercel Serverless (same domain), we use relative paths. 
// Locally we use localhost:8000.
// VITE_API_URL can be set to empty string in Vercel to force relative paths if needed, 
// but here we default to "" if VITE_API_URL is NOT set (assuming production same-domain).
// Wait, locally we need localhost.
// Strategy: If VITE_API_URL is set, use it. If not, check if we are in dev mode.
// Simpler: Just make it look at the window location or default to "" in prod.

export const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000' : '');

export const endpoints = {
    clients: `${API_URL}/api/v1/clients`,
    properties: `${API_URL}/api/v1/properties`,
    users: `${API_URL}/api/v1/users`,
    stats: `${API_URL}/api/v1/stats`,
    transactions: `${API_URL}/api/v1/transactions`,
    reports: `${API_URL}/api/v1/reports`,
    tenants: `${API_URL}/api/v1/tenants`,
};
