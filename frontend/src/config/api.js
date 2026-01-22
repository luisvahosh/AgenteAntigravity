/**
 * API Configuration
 * 
 * In development (local), it defaults to http://localhost:8000
 * In production (Vercel), it uses the VITE_API_URL environment variable.
 */

// Removing trailing slash if present to avoid double slashes
const cleanUrl = (url) => url.replace(/\/$/, '');

export const API_URL = cleanUrl(import.meta.env.VITE_API_URL || 'http://localhost:8000');

export const endpoints = {
    clients: `${API_URL}/api/v1/clients`,
    properties: `${API_URL}/api/v1/properties`,
    users: `${API_URL}/api/v1/users`,
    stats: `${API_URL}/api/v1/stats`,
    transactions: `${API_URL}/api/v1/transactions`,
    reports: `${API_URL}/api/v1/reports`,
    tenants: `${API_URL}/api/v1/tenants`,
};
