/**
 * Configuración centralizada de la API
 * 
 * Este archivo es la ÚNICA fuente de verdad para las URLs del backend.
 * Todas las URLs se construyen a partir de variables de entorno.
 * 
 * Para cambiar el entorno:
 * 1. Editar .env y cambiar VITE_API_BASE
 * 2. Reiniciar el servidor de desarrollo (npm run dev)
 */

/**
 * URL base del servidor (sin /api)
 * Lee de variable de entorno VITE_API_BASE
 * Fallback: http://localhost:8000
 */
export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

/**
 * URL completa de la API (con /api)
 * Usada por todos los servicios
 */
export const API_URL = `${API_BASE}/api`;
