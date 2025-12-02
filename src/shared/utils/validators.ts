/**
 * Utilidades de validación simples y claras
 * Cada función retorna null si es válido, o un mensaje de error si no lo es
 */

/**
 * Valida el nombre de usuario
 */
export const validateUserName = (name: string): string | null => {
  if (!name || name.trim() === '') {
    return 'El nombre es requerido';
  }

  const trimmedName = name.trim();
  
  if (trimmedName.length < 3) {
    return 'El nombre debe tener al menos 3 caracteres';
  }

  if (trimmedName.length > 50) {
    return 'El nombre no puede exceder 50 caracteres';
  }

  // Solo letras, números, espacios y guiones
  const namePattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s-]+$/;
  if (!namePattern.test(trimmedName)) {
    return 'El nombre solo puede contener letras, números, espacios y guiones';
  }

  return null;
};

/**
 * Valida la contraseña
 */
export const validatePassword = (password: string): string | null => {
  if (!password || password.trim() === '') {
    return 'La contraseña es requerida';
  }

  if (password.length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres';
  }

  if (password.length > 100) {
    return 'La contraseña no puede exceder 100 caracteres';
  }

  return null;
};

/**
 * Valida el rol de usuario
 */
export const validateUserRole = (rol: string): string | null => {
  if (!rol || rol.trim() === '') {
    return 'El rol es requerido';
  }

  const validRoles = ['admin', 'user'];
  if (!validRoles.includes(rol.toLowerCase())) {
    return 'El rol debe ser "admin" o "user"';
  }

  return null;
};

/**
 * Valida ID numérico positivo
 */
export const validatePositiveId = (id: any, fieldName: string = 'ID'): string | null => {
  if (id === null || id === undefined || id === '') {
    return `${fieldName} es requerido`;
  }

  const numId = Number(id);
  
  if (isNaN(numId)) {
    return `${fieldName} debe ser un número válido`;
  }

  if (numId <= 0) {
    return `${fieldName} debe ser mayor a 0`;
  }

  if (!Number.isInteger(numId)) {
    return `${fieldName} debe ser un número entero`;
  }

  return null;
};

/**
 * Valida nombre de localidad/zona
 */
export const validateLocality = (locality: string): string | null => {
  if (!locality || locality.trim() === '') {
    return 'La localidad es requerida';
  }

  const trimmedLocality = locality.trim();
  
  if (trimmedLocality.length < 2) {
    return 'La localidad debe tener al menos 2 caracteres';
  }

  if (trimmedLocality.length > 100) {
    return 'La localidad no puede exceder 100 caracteres';
  }

  // Permitir letras, números, espacios, puntos, comas y guiones
  const localityPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,-]+$/;
  if (!localityPattern.test(trimmedLocality)) {
    return 'La localidad contiene caracteres no permitidos';
  }

  return null;
};

/**
 * Valida latitud geográfica
 */
export const validateLatitude = (latitude: any): string | null => {
  if (latitude === null || latitude === undefined || latitude === '') {
    return 'La latitud es requerida';
  }

  const lat = Number(latitude);
  
  if (isNaN(lat)) {
    return 'La latitud debe ser un número válido';
  }

  if (lat < -90 || lat > 90) {
    return 'La latitud debe estar entre -90 y 90';
  }

  return null;
};

/**
 * Valida longitud geográfica
 */
export const validateLongitude = (longitude: any): string | null => {
  if (longitude === null || longitude === undefined || longitude === '') {
    return 'La longitud es requerida';
  }

  const lng = Number(longitude);
  
  if (isNaN(lng)) {
    return 'La longitud debe ser un número válido';
  }

  if (lng < -180 || lng > 180) {
    return 'La longitud debe estar entre -180 y 180';
  }

  return null;
};

/**
 * Valida datos completos de un usuario
 */
export interface UserData {
  name: string;
  password: string;
  rol: string;
  site_id: any;
  zona_id: any;
}

export const validateUserData = (userData: Partial<UserData>, requireZona = true): string | null => {
  const nameError = validateUserName(userData.name || '');
  if (nameError) return nameError;

  const passwordError = validatePassword(userData.password || '');
  if (passwordError) return passwordError;

  const roleError = validateUserRole(userData.rol || '');
  if (roleError) return roleError;

  const siteIdError = validatePositiveId(userData.site_id, 'El sitio');
  if (siteIdError) return siteIdError;

  if (requireZona) {
    const zonaIdError = validatePositiveId(userData.zona_id, 'La zona');
    if (zonaIdError) return zonaIdError;
  }

  return null;
};

/**
 * Valida datos de una zona
 */
export interface ZonaData {
  locality: string;
}

export const validateZonaData = (zonaData: Partial<ZonaData>): string | null => {
  return validateLocality(zonaData.locality || '');
};

/**
 * Valida número de reporte/cantidad
 */
export const validateAmount = (amount: any, min = 0, max = 10000): string | null => {
  if (amount === null || amount === undefined || amount === '') {
    return 'La cantidad es requerida';
  }

  const num = Number(amount);
  
  if (isNaN(num)) {
    return 'La cantidad debe ser un número válido';
  }

  if (num < min) {
    return `La cantidad debe ser mayor o igual a ${min}`;
  }

  if (num > max) {
    return `La cantidad debe ser menor o igual a ${max}`;
  }

  return null;
};

/**
 * Valida texto libre (notas, descripciones)
 */
export const validateText = (
  text: string, 
  minLength = 0, 
  maxLength = 500,
  fieldName = 'El texto'
): string | null => {
  if (minLength > 0 && (!text || text.trim() === '')) {
    return `${fieldName} es requerido`;
  }

  if (!text) return null; // Si es opcional y está vacío

  const trimmedText = text.trim();
  
  if (trimmedText.length < minLength) {
    return `${fieldName} debe tener al menos ${minLength} caracteres`;
  }

  if (trimmedText.length > maxLength) {
    return `${fieldName} no puede exceder ${maxLength} caracteres`;
  }

  return null;
};
