# Documentación del Sistema de Gestión de Turnos

## Descripción General
Este es un sistema backend desarrollado con NestJS y TypeScript para la gestión de turnos y citas. El sistema permite administrar usuarios, clientes, servicios ofrecidos, horarios y citas de manera eficiente.

## Tecnologías Principales
- **Framework**: NestJS v11
- **Lenguaje**: TypeScript
- **Base de Datos**: MySQL
- **ORM**: Prisma
- **Autenticación**: JWT (JSON Web Tokens)
- **Documentación API**: Swagger/OpenAPI

## Estructura del Proyecto

### Directorios Principales
- `/src`: Código fuente principal
  - `/modules`: Módulos de la aplicación
  - `/common`: Componentes y utilidades compartidas
  - `/config`: Configuraciones del sistema
- `/prisma`: Esquema y migraciones de la base de datos
- `/test`: Pruebas unitarias y e2e
- `/docs`: Documentación del proyecto

### Módulos del Sistema

#### 1. Autenticación (Auth)
- Gestión de usuarios y roles
- Sistema de login y registro
- Manejo de sesiones y tokens JWT

#### 2. Usuarios (Users)
- CRUD de usuarios
- Roles: ADMIN y MANAGER
- Gestión de perfiles

#### 3. Clientes (Customers)
- Registro y gestión de clientes
- Información de contacto
- Historial de citas

#### 4. Citas (Appointments)
- Creación y gestión de citas
- Estados: RESERVADO, TERMINADO, AUSENTE
- Asignación de servicios y horarios

#### 5. Horarios (Schedules)
- Configuración de horarios por usuario
- Gestión de días laborables
- Configuración de descansos
- Manejo de días festivos

#### 6. Servicios Ofrecidos (Offered Services)
- Catálogo de servicios
- Precios y descripciones
- Asignación a usuarios

#### 7. Configuración General (General Settings)
- Configuraciones globales del sistema
- Información de contacto del negocio
- Límites de reserva

## Modelo de Datos

### Entidades Principales

#### User
- Información personal y credenciales
- Rol en el sistema
- Relación con horarios y servicios

#### Schedule
- Configuración de horarios por usuario
- Gestión de días y descansos
- Control de días festivos

#### Appointment
- Registro de citas
- Estado y detalles del servicio
- Relación con cliente y horario

#### Customer
- Información de contacto
- Historial de citas

#### OfferedService
- Catálogo de servicios
- Precios y descripciones
- Asignación a usuarios

## API Endpoints

### Autenticación
- POST `/auth/login`: Inicio de sesión
- POST `/auth/register`: Registro de usuarios

### Usuarios
- GET `/users`: Listar usuarios
- POST `/users`: Crear usuario
- GET `/users/:id`: Obtener usuario
- PUT `/users/:id`: Actualizar usuario
- DELETE `/users/:id`: Eliminar usuario

### Clientes
- GET `/customers`: Listar clientes
- POST `/customers`: Crear cliente
- GET `/customers/:id`: Obtener cliente
- PUT `/customers/:id`: Actualizar cliente
- DELETE `/customers/:id`: Eliminar cliente

### Citas
- GET `/appointments`: Listar citas
- POST `/appointments`: Crear cita
- GET `/appointments/:id`: Obtener cita
- PUT `/appointments/:id`: Actualizar cita
- DELETE `/appointments/:id`: Eliminar cita

### Horarios
- GET `/schedules`: Listar horarios
- POST `/schedules`: Crear horario
- GET `/schedules/:id`: Obtener horario
- PUT `/schedules/:id`: Actualizar horario
- DELETE `/schedules/:id`: Eliminar horario

### Servicios
- GET `/services`: Listar servicios
- POST `/services`: Crear servicio
- GET `/services/:id`: Obtener servicio
- PUT `/services/:id`: Actualizar servicio
- DELETE `/services/:id`: Eliminar servicio

## Configuración del Proyecto

### Requisitos Previos
- Node.js (versión recomendada: 18+)
- MySQL
- npm o yarn

### Instalación
1. Clonar el repositorio
2. Instalar dependencias: `npm install`
3. Configurar variables de entorno
4. Ejecutar migraciones: `npx prisma migrate dev`
5. Iniciar el servidor: `npm run start:dev`

### Variables de Entorno
- `DATABASE_URL`: URL de conexión a la base de datos
- `JWT_SECRET`: Clave secreta para JWT
- `PORT`: Puerto del servidor

## Desarrollo

### Scripts Disponibles
- `npm run start`: Iniciar servidor
- `npm run start:dev`: Iniciar servidor en modo desarrollo
- `npm run build`: Compilar proyecto
- `npm run test`: Ejecutar pruebas
- `npm run lint`: Linting del código

### Convenciones de Código
- TypeScript strict mode
- ESLint y Prettier para formateo
- Arquitectura modular de NestJS
- Patrones de diseño recomendados

## Seguridad
- Autenticación JWT
- Encriptación de contraseñas con bcrypt
- Validación de datos con class-validator
- Protección de rutas por roles

## Mantenimiento
- Backups regulares de la base de datos
- Monitoreo de logs
- Actualizaciones de dependencias
- Pruebas automatizadas

## Contribución
1. Fork del repositorio
2. Crear rama feature
3. Commit de cambios
4. Push a la rama
5. Crear Pull Request

## Licencia
Este proyecto es privado y no está licenciado para uso público. 