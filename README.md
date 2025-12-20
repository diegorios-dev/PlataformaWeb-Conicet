# 🌧️ Sistema de Monitoreo de Precipitaciones

Sistema web de monitoreo y análisis de datos hidrológicos desarrollado para CONICET en colaboración con UNCO Bariloche. Permite gestionar y visualizar datos de precipitación (lluvia, nieve) y caudal en tiempo real a través de una red de estaciones de monitoreo distribuidas geográficamente.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19.1.1-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178c6.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 Índice

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Scripts Disponibles](#-scripts-disponibles)
- [Roles y Permisos](#-roles-y-permisos)
- [API Backend](#-api-backend)
- [Contribuir](#-contribuir)

## ✨ Características

### 🗺️ Visualización Geográfica Interactiva
- **Mapa interactivo** con marcadores dinámicos por tipo de instrumento
- **Tres capas base**: Vegetación, Topografía y Original
- **Marcadores diferenciados por color**:
  - 🔵 Azul: Pluviómetros (lluvia)
  - 🟠 Naranja: Reglas/Nivómetros (nieve)
  - 🔴 Rojo: Instrumentos averiados (solo visible para administradores)
- **Popups informativos** con datos de cada estación
- **Mini-mapa** de navegación
- **Filtrado por año** y tipo de evento

### 📊 Dashboard de Análisis y Estadísticas
- **12+ gráficos interactivos** con datos en tiempo real:
  - Análisis de frecuencia
  - Evolución mensual por tipo
  - Distribución por tipo de precipitación
  - Comparativa anual
  - Patrones mensuales
  - Top zonas por registro
  - Precipitación vs coordenadas geográficas
  - Y más...
- **Filtros dinámicos** por período (día, mes, año)
- **Exportación** de datos y gráficos
- **Gráficos responsivos** adaptados a diferentes dispositivos

### 📝 Gestión de Reportes
- **Reportes regulares**: Registro de mediciones con cantidad, unidad de medida, fecha y ubicación
- **Reportes de rotura**: Registro de instrumentos averiados con descripción del daño
- **Adjuntos multimedia**:
  - 📸 Imágenes (formato: jpg, png, webp)
  - 🎤 Audio (formato: m4a, mp3, wav)
- **Muestras adicionales** (opcional):
  - Química: pH, conductividad, Na
  - Isótopos: δ2H, 18O
  - Nivel freático
- **Paginación** y **ordenamiento** de reportes
- **Búsqueda avanzada** por ID, nota o zona
- **Filtros múltiples**: tipo, precipitación, zona

### 🎯 Histograma Temporal
- Visualización de distribución de frecuencia por tipo de instrumento
- Filtrado por período y tipo de evento
- Identificación de valores extremos y patrones temporales

### 🔐 Sistema de Autenticación
- **Login por contraseña** para administradores
- **Rutas protegidas** con componente `ProtectedRoute`
- **Persistencia de sesión** con tokens JWT
- **Roles diferenciados**: admin y usuario regular

### 🎨 Interfaz de Usuario Moderna
- **Diseño minimalista** y profesional con Tailwind CSS 4
- **Animaciones fluidas** con Framer Motion
- **Modo responsivo** para móviles, tablets y desktop
- **Dark mode** preparado (configurable)
- **Componentes reutilizables** y modulares
- **Accesibilidad** mejorada (ARIA labels, navegación por teclado)

### 🚀 Optimizaciones de Rendimiento
- **Memoización** de componentes con `React.memo`
- **Lazy loading** de rutas
- **Cache de datos** con `simple-statistics`
- **Imágenes optimizadas** en formato WebP
- **Code splitting** automático con Vite

## 🛠️ Tecnologías

### Frontend Core
- **React 19.1.1** - Librería UI
- **TypeScript 5.8.3** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router DOM 7.9.3** - Navegación SPA

### UI & Estilos
- **Tailwind CSS 4.1.13** - Framework CSS utility-first
- **Framer Motion 12.23.24** - Animaciones
- **Lucide React 0.544.0** - Iconos modernos
- **React Spinners 0.17.0** - Loading indicators

### Mapas & Visualización
- **Leaflet 1.9.4** - Mapas interactivos
- **React Leaflet 5.0.0** - Integración con React
- **Leaflet.heat** - Mapas de calor
- **Leaflet.markercluster** - Agrupación de marcadores
- **Leaflet-minimap** - Mini-mapa de navegación
- **Recharts 3.2.1** - Gráficos estadísticos
- **@turf/turf 7.2.0** - Análisis geoespacial

### Utilidades
- **Axios 1.12.2** - Cliente HTTP
- **html2canvas 1.4.1** - Captura de pantalla
- **jsPDF 3.0.3** - Generación de PDFs
- **jspdf-autotable 5.0.2** - Tablas en PDF
- **Simple Statistics 7.8.8** - Cálculos estadísticos

### Desarrollo
- **ESLint 9.35.0** - Linter
- **TypeScript ESLint 8.43.0** - Reglas TS
- **Vite Plugin React SWC** - Compilación rápida

## 📦 Requisitos Previos

- **Node.js** >= 18.x
- **npm** >= 9.x o **yarn** >= 1.22.x
- **Git**
- Navegador moderno (Chrome, Firefox, Edge, Safari)

## 🚀 Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/precipitacionWeb.git
cd precipitacionWeb
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env` con tu configuración:
```env
VITE_API_BASE=http://localhost:8000
```

4. **Iniciar servidor de desarrollo**
```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en `http://localhost:5173`

## ⚙️ Configuración

### Variables de Entorno

| Variable | Descripción | Por Defecto | Requerido |
|----------|-------------|-------------|-----------|
| `VITE_API_BASE` | URL base del backend API | `http://localhost:8000` | ✅ |

### Configuración de Alias

El proyecto utiliza alias de importación para una mejor organización:

```typescript
'@': './src'
'@features': './src/features'
'@shared': './src/shared'
'@context': './src/context'
'@config': './src/config'
```

Ejemplo de uso:
```typescript
import { useAuth } from '@features/auth';
import { httpGet } from '@shared/services';
```

## 📖 Uso

### Acceso Inicial
1. Navegar a la página principal
2. Ver el mapa interactivo con las estaciones de monitoreo
3. Filtrar por tipo de evento (Lluvia/Nieve)
4. Hacer clic en los marcadores para ver detalles

### Panel de Administración (requiere login)
1. Hacer clic en "Acceso Administrativo"
2. Ingresar contraseña de administrador
3. Acceder al dashboard con funcionalidades completas

### Crear Reporte Regular
1. Dashboard → "Registrar Reporte"
2. Seleccionar zona y sitio
3. Ingresar cantidad y unidad de medida
4. (Opcional) Agregar muestras químicas, isótopos, nivel freático
5. (Opcional) Adjuntar imagen y/o audio
6. Guardar reporte

### Reportar Instrumento Averiado
1. Dashboard → "Reportar Rotura"
2. Seleccionar zona y sitio afectado
3. Describir el daño o avería
4. (Opcional) Adjuntar evidencia fotográfica y/o audio
5. Enviar reporte

### Ver Estadísticas
1. Dashboard → "Estadísticas"
2. Seleccionar período de análisis
3. Visualizar gráficos interactivos
4. Exportar datos si es necesario

### Ver Histogramas
1. Home → Herramientas → "Ver Histograma"
2. Seleccionar tipo de instrumento y período
3. Analizar distribución de frecuencias

## 📁 Estructura del Proyecto

```
precipitacionWeb/
├── public/                      # Archivos estáticos públicos
│   └── assets/                  # Imágenes, logos
├── src/
│   ├── assets/                  # Assets optimizados (WebP)
│   │   └── index.ts            # Exportación centralizada
│   ├── config/                  # Configuración global
│   │   └── api.ts              # Config API (URL base)
│   ├── context/                 # Context API global
│   │   └── ReportContext.tsx   # Estado de reportes
│   ├── features/                # Módulos por funcionalidad
│   │   ├── auth/               # Autenticación
│   │   │   ├── components/    # Login, ProtectedRoute
│   │   │   ├── context/       # AuthContext
│   │   │   └── hooks/         # useUser
│   │   ├── charts/            # Gráficos estadísticos
│   │   │   ├── services/      # API de estadísticas
│   │   │   └── *.tsx          # Componentes de gráficos
│   │   ├── dashboard/         # Panel administrativo
│   │   ├── event/             # Eventos (Lluvia, Nieve, Caudal)
│   │   ├── excel/             # Exportación Excel
│   │   ├── histogram/         # Histogramas temporales
│   │   ├── home/              # Página principal
│   │   ├── map/               # Mapa interactivo
│   │   │   ├── components/   # MapHTML, MarkerSite
│   │   │   ├── constants/    # Configuración mapas
│   │   │   └── types/        # Interfaces
│   │   ├── menu/              # Menús de navegación
│   │   ├── report/            # Gestión de reportes
│   │   │   ├── components/   # Formularios, listados
│   │   │   ├── hooks/        # useReports
│   │   │   ├── services/     # API de reportes
│   │   │   └── types/        # Report interfaces
│   │   ├── site/              # Sitios de medición
│   │   ├── user/              # Usuarios
│   │   └── zone/              # Zonas geográficas
│   ├── shared/                 # Código compartido
│   │   ├── hooks/             # Custom hooks
│   │   ├── services/          # HTTP, Storage, Token
│   │   ├── ui/                # Componentes UI reutilizables
│   │   │   ├── atoms/        # Botones, inputs, badges
│   │   │   ├── molecules/    # SearchBar, CustomSelect
│   │   │   ├── layouts/      # DashboardLayout
│   │   │   └── Loading/      # Estados de carga
│   │   └── utils/             # Utilidades
│   ├── App.tsx                # Componente raíz
│   ├── main.tsx               # Entry point
│   └── index.css              # Estilos globales
├── .env                        # Variables de entorno
├── .env.example               # Ejemplo de configuración
├── package.json               # Dependencias
├── tsconfig.json              # Config TypeScript
├── vite.config.ts             # Config Vite
├── tailwind.config.js         # Config Tailwind
└── README.md                  # Este archivo
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo

# Build
npm run build        # Compilar para producción
npm run preview      # Preview del build

# Calidad de código
npm run lint         # Ejecutar ESLint
npm run type-check   # Verificar tipos TypeScript

# Limpieza
npm run clean        # Eliminar dist y node_modules
```

## 👥 Roles y Permisos

### Usuario Regular (Sin login)
- ✅ Ver mapa interactivo
- ✅ Ver marcadores saludables
- ✅ Consultar información de estaciones
- ✅ Ver histogramas públicos
- ❌ No puede ver instrumentos averiados
- ❌ No puede crear reportes
- ❌ No puede acceder al dashboard

### Administrador (Con login)
- ✅ Todo lo del usuario regular
- ✅ Ver instrumentos averiados (marcadores rojos)
- ✅ Crear reportes regulares
- ✅ Reportar roturas
- ✅ Acceso al dashboard completo
- ✅ Ver estadísticas avanzadas
- ✅ Gestionar sitios y zonas
- ✅ Exportar datos

## 🌐 API Backend

El frontend consume una API REST. Endpoints principales:

### Reportes
```
GET    /api/v1/reports?order=desc&page=1&per_page=15
POST   /api/v1/reports
PUT    /api/v1/reports/:id
DELETE /api/v1/reports/:id
```

### Reportes de Rotura
```
POST   /api/v1/breakage-reports
DELETE /api/v1/breakage-reports/:id
```

### Estadísticas
```
GET /api/v1/estadisticas/reportes-instrumento
GET /api/v1/estadisticas/distribucion-tipo
GET /api/v1/estadisticas/evolucion-mensual
GET /api/v1/estadisticas/patron-mensual
GET /api/v1/estadisticas/analisis-frecuencia
```

### Sitios y Zonas
```
GET /api/v1/sites
GET /api/v1/zones
```

### Autenticación
```
POST /api/v1/login
```

**Nota**: Configurar la URL base en `.env` → `VITE_API_BASE`

## 🎨 Personalización

### Colores del Tema
Editar `tailwind.config.js` o usar clases de Tailwind:

```typescript
// Azul principal
bg-blue-600 
// Naranja secundario
bg-orange-600
// Rojo alerta
bg-red-600
```

### Mapas Base
Editar `src/features/map/constants/tileConfigs.ts`:

```typescript
export const tileConfigs = {
  vegetacion: { url: '...', attribution: '...' },
  topografia: { url: '...', attribution: '...' },
  // Agregar más capas
};
```

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir un Pull Request

### Guía de Estilo
- Usar TypeScript para todos los archivos
- Seguir las reglas de ESLint
- Componentes funcionales con hooks
- Nombrar archivos en PascalCase para componentes
- Comentarios en español o inglés

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

## 👨‍💻 Autores

- **Equipo de Desarrollo CONICET**
- **UNCO Bariloche**

## 📞 Contacto

Para consultas o soporte, contactar a:
- Email: contacto@conicet.gov.ar
- Web: https://www.conicet.gov.ar

## 🙏 Agradecimientos

- CONICET
- UNCO Bariloche
- FAI
- INTA

---

## 📸 Screenshots

<!-- Agregar capturas de pantalla aquí -->

### Mapa Principal
<img width="1906" height="891" alt="image" src="https://github.com/user-attachments/assets/a9bc30d1-dcce-467e-930f-c0fd5b4009bd" />

### Dashboard Administrativo
<img width="1903" height="910" alt="image" src="https://github.com/user-attachments/assets/96838912-e4d0-4293-af32-e62a495ca411" />


### Gráficos Estadísticos
<img width="1909" height="908" alt="image" src="https://github.com/user-attachments/assets/73128a55-bc4e-43c4-80dc-129d6c81b8a3" />


**Desarrollado con ❤️ para la comunidad científica**
