# Validación de Formularios - Implementación Completa

## Problema #10: Validación de formularios insuficiente

### ✅ Solución Implementada

Se implementó un sistema robusto de validación en todos los formularios de la aplicación usando funciones simples, claras y reutilizables.

---

## 📦 Archivo Creado: validators.ts

**Ubicación:** `src/shared/utils/validators.ts`

### Funciones de Validación

#### 1. **validateUserName(name: string)**
- Verifica que no esté vacío
- Mínimo 3 caracteres
- Máximo 50 caracteres
- Solo letras, números, espacios y guiones
- Permite caracteres acentuados (español)

#### 2. **validatePassword(password: string)**
- Verifica que no esté vacío
- Mínimo 6 caracteres
- Máximo 100 caracteres

#### 3. **validateUserRole(rol: string)**
- Verifica que no esté vacío
- Solo valores válidos: "admin" o "user"

#### 4. **validatePositiveId(id: any, fieldName: string)**
- Verifica que no esté vacío
- Debe ser un número válido
- Debe ser mayor a 0
- Debe ser un entero

#### 5. **validateLocality(locality: string)**
- Verifica que no esté vacía
- Mínimo 2 caracteres
- Máximo 100 caracteres
- Permite letras, números, espacios, puntos, comas y guiones

#### 6. **validateLatitude(latitude: any)**
- Verifica que no esté vacío
- Debe ser un número válido
- Rango: -90 a 90

#### 7. **validateLongitude(longitude: any)**
- Verifica que no esté vacío
- Debe ser un número válido
- Rango: -180 a 180

#### 8. **validateAmount(amount: any, min, max)**
- Verifica que no esté vacío
- Debe ser un número válido
- Verifica rango min/max configurable

#### 9. **validateText(text: string, minLength, maxLength, fieldName)**
- Validación genérica de texto
- Configurable: mínimo, máximo, nombre del campo
- Soporta campos opcionales

#### 10. **validateEmail(email: string)**
- Verifica formato de email válido
- Máximo 100 caracteres

### Funciones Compuestas

#### **validateUserData(userData: Partial<UserData>)**
Valida todos los campos de un usuario:
- Nombre (validateUserName)
- Contraseña (validatePassword)
- Rol (validateUserRole)
- ID de sitio (validatePositiveId)
- ID de zona (validatePositiveId)

#### **validateZonaData(zonaData: Partial<ZonaData>)**
Valida datos de zona:
- Localidad (validateLocality)
