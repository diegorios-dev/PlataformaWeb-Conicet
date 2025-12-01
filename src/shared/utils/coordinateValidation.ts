/**
 * Valida si una coordenada es válida
 * @param coord - Array con [latitud, longitud]
 * @returns true si la coordenada es válida
 */
export function isValidCoordinate(coord: any): boolean {
  // Verificar que sea un array
  if (!Array.isArray(coord)) {
    return false;
  }
  
  // Verificar que tenga exactamente 2 elementos
  if (coord.length !== 2) {
    return false;
  }
  
  const [lat, lng] = coord;
  
  // Verificar que sean números
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return false;
  }
  
  // Verificar que no sean NaN
  if (isNaN(lat) || isNaN(lng)) {
    return false;
  }
  
  // Verificar rangos válidos
  // Latitud: -90 a 90
  // Longitud: -180 a 180
  if (lat < -90 || lat > 90) {
    return false;
  }
  
  if (lng < -180 || lng > 180) {
    return false;
  }
  
  return true;
}

/**
 * Obtiene una coordenada por defecto si la provista no es válida
 * @param coord - Coordenada a validar
 * @param defaultCoord - Coordenada por defecto (Neuquén, Argentina)
 * @returns La coordenada si es válida, o la coordenada por defecto
 */
export function getValidCoordinateOrDefault(
  coord: any, 
  defaultCoord: [number, number] = [-38.95, -68.06]
): [number, number] {
  return isValidCoordinate(coord) ? coord : defaultCoord;
}
