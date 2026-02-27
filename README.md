# Todo es Alquilable

Marketplace de alquiler para Ecuador. Publica y encuentra artículos en renta: herramientas, electrónica, deportes, vehículos y mucho más.

**Dominio:** www.todoesalquilable.com

## Stack tecnológico

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend:** Firebase (Auth, Firestore, Storage, Cloud Functions)
- **Testing:** Vitest, React Testing Library
- **CI/CD:** GitHub Actions, Firebase Hosting

## Inicio rápido

### Prerrequisitos

- Node.js 18+
- npm
- Firebase CLI (`npm install -g firebase-tools`)
- Proyecto Firebase configurado

### Instalación

```bash
# Clonar el repositorio
git clone <repo-url>
cd todo-es-alquilable

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con las credenciales de Firebase

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

### Variables de entorno

Copia `.env.local.example` a `.env.local` y completa con los valores de tu proyecto Firebase:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | Linter (ESLint) |
| `npm test` | Ejecutar tests |
| `npm run test:watch` | Tests en modo watch |
| `npm run test:coverage` | Tests con reporte de cobertura |

## Estructura del proyecto

```
src/
├── app/                    # Páginas (App Router)
│   ├── (auth)/             # Login, registro
│   ├── (main)/             # Buscar, publicar, anuncio, perfil, mis-anuncios
│   └── admin/              # Panel de administración
├── features/               # Módulos por funcionalidad
│   ├── auth/               # Autenticación
│   ├── listings/           # Anuncios (CRUD, formulario, cards)
│   ├── search/             # Búsqueda y filtros
│   ├── profile/            # Perfil de usuario
│   └── admin/              # Administración y moderación
├── shared/                 # Código compartido
│   ├── components/         # UI (Button, Input, etc.), Layout, Feedback
│   ├── providers/          # AuthProvider, ToastProvider
│   └── types/              # Tipos globales
├── lib/
│   ├── firebase/           # Configuración y servicios Firebase
│   └── dominio/            # Datos y utilidades del dominio
└── test/                   # Setup de tests y mocks
```

## Funcionalidades

### Usuarios
- Registro con email, teléfono (+593), provincia, ciudad y dirección
- Login/logout con Firebase Auth
- Perfil editable con foto
- Roles: user, moderator, admin, super_admin

### Anuncios
- Formulario multi-paso: Categoría > Fotos > Detalles > Precio > Revisión
- Hasta 8 fotos por anuncio (max 5MB cada una)
- Condición del artículo (nuevo, como nuevo, buen estado, aceptable)
- Precio por hora, día, semana o mes (USD)
- Moderación antes de publicación
- Contacto directo por WhatsApp

### Búsqueda
- Búsqueda por texto con debounce
- Filtros por categoría, provincia, rango de precio
- Ordenamiento por fecha o precio
- Paginación con cursor

### Admin
- Cola de moderación con aprobación/rechazo
- Gestión de categorías (CRUD + sugeridas por usuarios)
- Gestión de usuarios y roles (super_admin)

## Modelo de datos (Firestore)

### users
`uid, email, displayName, photoURL, phone, province, city, address, role, activeListingCount, createdAt, updatedAt`

### listings
`id, title, titleLower, description, categoryId, categoryName, condition, price, priceUnit, province, images[], thumbnails[], ownerId, ownerName, ownerPhone, ownerPhotoURL, status, rejectionReason, moderatorId, moderatedAt, viewCount, createdAt, updatedAt`

### categories
`id, name, nameLower, icon, listingCount, isActive, createdAt`

## Seguridad

- **Firestore Rules:** Acceso basado en roles, validación de propiedad, protección a nivel de campo
- **Storage Rules:** Límites de tamaño (5MB imágenes, 2MB avatares), solo tipos de imagen
- **Auth:** Custom claims para roles, AuthGuard para protección de rutas

## Despliegue

```bash
# Build
npm run build

# Deploy a Firebase
firebase deploy

# Solo hosting
firebase deploy --only hosting

# Solo funciones
firebase deploy --only functions

# Solo reglas
firebase deploy --only firestore:rules,storage
```

## Testing

```bash
# Todos los tests
npm test

# Con cobertura
npm run test:coverage

# En modo watch
npm run test:watch
```

**Objetivos de cobertura:**
- Validators/Formatters: 100%
- Services: 90%
- Hooks: 80%
- Components: 70%
- Pages: 60%

## Seed de datos iniciales

Después de configurar el proyecto Firebase:

1. Crear un usuario admin en Firebase Auth
2. Configurar custom claims: `admin.auth().setCustomUserClaims(uid, { role: 'super_admin' })`
3. Crear documento en `/users/{uid}` con role `super_admin`
4. Crear las 12 categorías iniciales en `/categories`

Ver `scripts/seed-data.ts` como referencia.

## Categorías iniciales

| Categoría | Icono |
|-----------|-------|
| Herramientas | 🔧 |
| Electrónica | 💻 |
| Deportes | ⚽ |
| Vehículos | 🚗 |
| Hogar | 🏠 |
| Eventos y Fiestas | 🎉 |
| Ropa y Disfraces | 👗 |
| Música | 🎵 |
| Fotografía y Video | 📷 |
| Camping y Aventura | ⛺ |
| Bebés y Niños | 👶 |
| Oficina | 📋 |

## Licencia

Privado. Todos los derechos reservados.
