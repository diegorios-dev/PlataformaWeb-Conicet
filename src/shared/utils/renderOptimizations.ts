/**
 * ⚡ Optimizaciones de Re-Renders
 * 
 * Hooks optimizados con React.memo, useCallback y useMemo
 * para reducir re-renders innecesarios.
 */

import { memo } from 'react';

/**
 * HOC para componentes que solo dependen de props
 * Evita re-renders si las props no cambian
 */
export const withMemo = <P extends object>(
  Component: React.ComponentType<P>,
  propsAreEqual?: (prev: P, next: P) => boolean
) => {
  return memo(Component, propsAreEqual);
};

/**
 * Comparador personalizado para objetos simples
 */
export const shallowEqual = (prev: any, next: any): boolean => {
  if (prev === next) return true;
  
  if (typeof prev !== 'object' || typeof next !== 'object') return false;
  if (prev === null || next === null) return false;
  
  const keysA = Object.keys(prev);
  const keysB = Object.keys(next);
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (prev[key] !== next[key]) return false;
  }
  
  return true;
};

/**
 * Comparador para arrays
 */
export const arrayEqual = (prev: any[], next: any[]): boolean => {
  if (prev === next) return true;
  if (prev.length !== next.length) return false;
  
  return prev.every((item, index) => item === next[index]);
};

export default withMemo;
