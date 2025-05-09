# Documentación Técnica - Sistema de Gestión de Turnos

## Descripción General
Este sistema es una aplicación backend desarrollada con NestJS que gestiona turnos y citas para servicios. La aplicación está construida utilizando una arquitectura modular y sigue los principios de diseño de NestJS.

## Tecnologías Principales
- **Framework**: NestJS v11
- **Lenguaje**: TypeScript
- **Base de Datos**: MySQL
- **ORM**: Prisma
- **Autenticación**: JWT (JSON Web Tokens)
- **Documentación API**: Swagger/OpenAPI

## Estructura del Proyecto

### Directorios Principales
```
src/
├── config/         # Configuraciones de la aplicación
├── common/         # Componentes compartidos
├── modules/        # Módulos de la aplicación
└── main.ts         # Punto de entrada de la aplicación
```

### Módulos Principales
1. **Auth Module**
   - Gestión de autenticación y autorización
   - Implementación de JWT
   - Control de roles de usuario

2. **Users Module**
   - Gestión de usuarios del sistema
   - Roles: ADMIN y MANAGER

3. **Appointments Module**
   - Gestión de citas y turnos
   - Estados: RESERVADO, TERMINADO, AUSENTE

4. **Schedules Module**
   - Configuración de horarios
   - Gestión de días laborables
   - Configuración de descansos
   - Gestión de días festivos

5. **Customers Module**
   - Gestión de clientes
   - Información de contacto

6. **Offered Services Module**
   - Catálogo de servicios ofrecidos
   - Precios y descripciones

## Modelo de Datos

### Entidades Principales

#### User
- Gestión de usuarios del sistema
- Campos principales: id, firstName, lastName, email, password, role
- Roles: ADMIN, MANAGER

#### Schedule
- Configuración de horarios por usuario
- Relaciones con ScheduleDayConfig y ScheduleHoliday
- Gestión de citas asociadas

#### ScheduleDayConfig
- Configuración diaria de horarios
- Días de la semana (LUNES a DOMINGO)
- Horarios de inicio y fin
- Intervalos de tiempo
- Configuración de descansos

#### Appointment
- Gestión de citas
- Estados: RESERVADO, TERMINADO, AUSENTE
- Relación con clientes y horarios
- Información del servicio

#### Customer
- Información de clientes
- Campos: firstName, lastName, phoneNumber, email
- Relación con citas

#### OfferedService
- Catálogo de servicios
- Campos: title, description, price

## API Endpoints

La API está documentada con Swagger y puede ser accedida en la ruta `/api` cuando el servidor está en ejecución.

### Autenticación
- POST `/auth/login` - Inicio de sesión
- POST `/auth/register` - Registro de usuarios

### Usuarios
- GET `/users` - Listar usuarios
- POST `/users` - Crear usuario
- GET `/users/:id` - Obtener usuario
- PUT `/users/:id` - Actualizar usuario
- DELETE `/users/:id` - Eliminar usuario

### Horarios
- GET `/schedules` - Listar horarios
- POST `/schedules` - Crear horario
- GET `/schedules/:id` - Obtener horario
- PUT `/schedules/:id` - Actualizar horario
- DELETE `/schedules/:id` - Eliminar horario

### Citas
- GET `/appointments` - Listar citas
- POST `/appointments` - Crear cita
- GET `/appointments/:id` - Obtener cita
- PUT `/appointments/:id` - Actualizar cita
- DELETE `/appointments/:id` - Eliminar cita

## Configuración del Entorno

### Variables de Entorno
- `DATABASE_URL`: URL de conexión a la base de datos MySQL
- `JWT_SECRET`: Clave secreta para JWT
- `PORT`: Puerto del servidor (por defecto: 3000)

### Scripts Disponibles
- `npm run start`: Iniciar servidor
- `npm run start:dev`: Iniciar servidor en modo desarrollo
- `npm run build`: Compilar proyecto
- `npm run test`: Ejecutar pruebas
- `npm run lint`: Ejecutar linter

## Seguridad
- Autenticación mediante JWT
- Encriptación de contraseñas con bcrypt
- Validación de datos con class-validator
- Protección de rutas basada en roles

## Base de Datos
- MySQL como motor de base de datos
- Prisma como ORM
- Migraciones automáticas
- Relaciones y restricciones de integridad referencial

## Consideraciones de Desarrollo
- Código modular y mantenible
- Patrones de diseño de NestJS
- Validación de datos
- Manejo de errores centralizado
- Documentación de API con Swagger

## Despliegue
1. Configurar variables de entorno
2. Ejecutar migraciones de base de datos
3. Compilar el proyecto
4. Iniciar el servidor en modo producción

## Mantenimiento
- Monitoreo de logs
- Backups regulares de la base de datos
- Actualizaciones de dependencias
- Revisión de seguridad periódica 