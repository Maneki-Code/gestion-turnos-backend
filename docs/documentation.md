# 📘 Documentación del Sistema de Reservas

Este sistema permite gestionar la reserva de turnos para distintos profesionales. Cada usuario puede definir su disponibilidad semanal, incluyendo intervalos de atención, horarios de descanso, y turnos reservables por clientes. La lógica está diseñada para ser flexible y adaptarse a distintas configuraciones horarias.

---

## 📂 Entidades del Sistema

### 🧑‍💼 User (Usuario)

Representa a los profesionales que ofrecen turnos. Cada usuario puede tener un rol dentro del sistema y un horario de atención asignado. El sistema permite gestionar usuarios, específicamente `ADMIN` y `MANAGER`. Cuando un `ADMIN` crea un usuario de tipo `MANAGER`, se genera automáticamente una **agenda** con valores por defecto, que permite al `MANAGER` comenzar a gestionar sus turnos de manera inmediata.

**Campos principales:**

- `id`: Identificador único.
- `firstName`: Nombre del usuario.
- `lastName`: Apellido del usuario.
- `email`: Correo electrónico (único).
- `password`: Contraseña hasheada.
- `role`: Rol del usuario (`ADMIN` o `MANAGER`).
- `createdAt`, `updatedAt`: Timestamps de creación y actualización.
- `schedule`: Relación 1:1 con su horario (`Schedule`).

**Relaciones:**

- 1:1 con `Schedule`.


## **🔧 Funcionalidades:**

### 👑 **ADMIN**

- **Crear un Manager**
  - **Descripción**: El `ADMIN` tiene la capacidad de crear nuevos usuarios de tipo `MANAGER`, especificando su nombre, apellido, email y contraseña. Al crear un `MANAGER`, el sistema genera automáticamente una agenda predeterminada asociada a ese usuario, lo que le permite comenzar a definir su disponibilidad para turnos sin intervención adicional.
  - **Entrada**: nombre, apellido, email, contraseña.
  - **Salida**: El `MANAGER` es creado con un ID único y una agenda predeterminada. El sistema devuelve un objeto con los datos del nuevo `MANAGER` y su agenda asociada.
  
- **Listar todos los Managers**
  - **Descripción**: El `ADMIN` puede obtener un listado completo de todos los `MANAGER` registrados en el sistema. Esto es útil para tener una visión general de los profesionales disponibles.
  - **Entrada**: Ninguno.
  - **Salida**: Lista de todos los `MANAGER` con detalles básicos como nombre, apellido, email, y rol.

- **Ver detalles de un Manager**
  - **Descripción**: El `ADMIN` puede ver un perfil detallado de un `MANAGER`, que incluye información sobre su agenda y estadísticas (por ejemplo, número de turnos tomados, cantidad de ausencias, etc.).
  - **Entrada**: ID del `MANAGER`.
  - **Salida**: Datos completos del `MANAGER`, incluidas sus estadísticas de turnos y su agenda.

- **Filtrar Managers**
  - **Descripción**: El `ADMIN` puede aplicar filtros a la lista de `MANAGERS` para facilitar la búsqueda de usuarios específicos según distintos criterios (por ejemplo, nombre, email o estado).
  - **Entrada**: Filtros de búsqueda (por nombre, email, etc.).
  - **Salida**: Lista de `MANAGER` que cumplen con los criterios de filtrado.

- **Modificar perfil personal** (nombre, apellido, email, contraseña)
  - **Descripción**: El `ADMIN` pueden actualizar sus datos personales, como nombre, apellido, email y contraseña. 
  - **Entrada**: nombre, apellido, email, contraseña. *OPCIONALES*
  - **Salida**: El perfil del `ADMIN` se actualiza con los nuevos datos proporcionados.

#### 🧑‍💼 **MANAGER**

- **Modificar perfil personal** (nombre, apellido, email, contraseña)
  - **Descripción**: Los `MANAGERS` pueden actualizar sus datos personales, como nombre, apellido, email y contraseña. Esto les permite mantener su información al día sin la intervención de un administrador.
  - **Entrada**: nombre, apellido, email, contraseña.
  - **Salida**: El perfil del `MANAGER` se actualiza con los nuevos datos proporcionados.

- **Consultar su propio perfil**
  - **Descripción**: El `MANAGER` puede acceder a su propio perfil para ver los detalles de su cuenta, incluyendo su nombre, email y la agenda asociada.
  - **Entrada**: Ninguno.
  - **Salida**: Información completa de su perfil, incluyendo datos personales y su agenda de disponibilidad.

**Notas:**
1. La **agenda** del `MANAGER` se genera automáticamente al momento de su creación. Esta agenda tiene valores predeterminados, que luego el `MANAGER` podrá modificar según sus necesidades.
2. **El `ADMIN`** tiene la capacidad de gestionar todos los `MANAGER`, mientras que el **`MANAGER`** solo puede gestionar su propio perfil y su agenda.


---

### 🗓️ Schedule (Horario)

Representa la disponibilidad general de un usuario. Incluye los días configurados con horarios específicos y los turnos asociados. El sistema permite gestionar las agendas de los usuarios tipo `Manager`, pero sólo puede ser configurada y modificada por el `ADMIN`. La agenda de un `Manager` se define especificando los días hábiles, las horas de inicio y fin, y el intervalo entre los turnos. Además, el `ADMIN` puede gestionar los descansos dentro de esa agenda.

**Campos principales:**

- `id`: Identificador único.
- `userId`: Clave foránea al usuario (única).
- `appointments`: Turnos asignados a este horario.
- `scheduleDays`: Configuración detallada por día de la semana.
- `createdAt`, `updatedAt`: Timestamps.

**Relaciones:**

- 1:1 con `User`.
- 1:N con `Appointment`.
- 1:N con `ScheduleDayConfig`.

## 📅 ScheduleDayConfig (Días del Horario)

Define la disponibilidad de un usuario para un día específico de la semana.

**Campos principales:**

- `id`: Identificador único.
- `scheduleId`: Clave foránea al horario general (`Schedule`).
- `day`: Día de la semana (`EDayOfWeek`).
- `startTime`, `endTime`: Horarios de inicio y fin del día laboral (formato `HH:mm`).
- `slotInterval`: Duración de cada turno en minutos.
- `status`: Indica si el día está habilitado o no.
- `rests`: Rango(s) de descanso durante el día (ver `ScheduleDayRestConfig`).
- `createdAt`, `updatedAt`: Timestamps.

**Relaciones:**

- 1:N con `ScheduleDayRestConfig`.
- Cada combinación de `scheduleId` + `day` es única.

## 💤 ScheduleDayRestConfig (Descansos del Día)

Define los intervalos de descanso en un día laboral. Se pueden configurar múltiples descansos por día.

**Campos principales:**

- `id`: Identificador único.
- `scheduleDayId`: Clave foránea al día del horario.
- `startTime`, `endTime`: Intervalo de descanso.
- `createdAt`, `updatedAt`: Timestamps.

**Relaciones:**

- N:1 con `ScheduleDayConfig`.

## **🔧 Funcionalidades:**

#### 👑 **ADMIN**

- **Modificar la agenda de un Manager**
  - **Descripción**: El `ADMIN` puede modificar la agenda de un `Manager`, especificando los días hábiles, la hora de inicio y la hora de fin de la jornada laboral, y el intervalo entre turnos. El sistema permite configurar la agenda en función de las necesidades del `Manager`, pero siempre con la restricción de que el horario de inicio no puede ser posterior al horario de fin, ni el horario de fin anterior al horario de inicio.
  - **Entrada**: días hábiles, hora de inicio, hora de fin, intervalo de turnos.
  - **Salida**: La agenda del `Manager` es modificada con los nuevos parámetros. El sistema valida las restricciones de horarios antes de aplicar los cambios.

- **Gestionar descansos en la agenda**
  - **Descripción**: El `ADMIN` puede agregar, modificar o eliminar los descansos dentro de la agenda de un `Manager`. Cada descanso debe especificar un horario de inicio y fin. El sistema asegura que el horario de inicio del descanso no sea anterior al horario de inicio de la jornada laboral, ni posterior al horario de fin de la jornada. Además, verifica que los descansos no se solapen entre sí.
  - **Entrada**: horario de inicio del descanso, horario de fin del descanso.
  - **Salida**: Los descansos se agregan, modifican o eliminan en la agenda del `Manager`. El sistema valida que los descansos no se solapen ni sean fuera del rango de la jornada laboral.

**Notas:**
1. El `MANAGER` no tiene acceso para modificar su propia agenda; toda la configuración es gestionada por el `ADMIN`.
2. El sistema valida las restricciones de tiempo, como que el horario de inicio de la jornada no sea posterior al de fin, y que los descansos no se solapen ni se configuren fuera de la jornada laboral.

---

### 📌 Appointment (Turno)

Representa un turno reservado (o disponible) dentro del horario de un usuario. El sistema permite gestionar los turnos de los `Managers` y `Admins`, incluyendo la visualización, creación, modificación y eliminación de turnos. Cada turno tiene un estado, que puede ser "Reservado", "Finalizado" o "Ausente".

**Campos principales:**

- `id`: Identificador único.
- `date`: Fecha del turno.
- `startTime`, `endTime`: Horario del turno.
- `description`: Texto opcional descriptivo del turno.
- `status`: Estado actual del turno (`RESERVADO`, `TERMINADO`, `AUSENTE`).
- `customerId`: Cliente asignado (opcional).
- `scheduleId`: A qué horario pertenece este turno.
- `createdAt`, `updatedAt`: Timestamps.

**Relaciones:**

- N:1 con `Schedule`.
- Opcionalmente N:1 con `Customer`.

## **🔧 Funcionalidades:**

#### 👑 **ADMIN** y 🧑‍💼 **MANAGER**

* **Visualizar listado de turnos diarios**

  * **Descripción**: Tanto el `ADMIN` como el `MANAGER` pueden visualizar un listado de sus turnos diarios. Esto les permite ver todos los turnos programados para ese día. El sistema obtiene todos los turnos asociados al `MANAGER` o al `ADMIN`, dependiendo del rol, y los organiza por fecha para su visualización.
  * **Entrada**: Ninguno (el sistema utiliza la fecha actual para mostrar los turnos del día).
  * **Salida**: Lista de turnos programados para el día, con detalles como hora de inicio, cliente, estado y `Manager` asignado.

* **Ver detalle de un turno**

  * **Descripción**: El `ADMIN` y el `MANAGER` pueden ver los detalles completos de un turno específico. Esto incluye la información sobre el cliente, la hora, la duración, el estado y el `Manager` asignado. Al solicitar el detalle de un turno, el sistema muestra toda la información asociada al turno seleccionado.
  * **Entrada**: ID del turno.
  * **Salida**: Detalles completos del turno seleccionado.

* **Crear un turno**

  * **Descripción**: El `ADMIN` y el `MANAGER` pueden crear un turno para un cliente especificando la hora, el día, el nombre del cliente, teléfono y email. Si el número de teléfono ingresado ya está asociado a un cliente existente, el formulario se completará automáticamente con los datos del cliente. Si no existe, se creará un nuevo cliente. El sistema valida si el cliente ya existe en la base de datos. Si el número de teléfono ya está registrado, completa los datos automáticamente; de lo contrario, crea un nuevo registro para el cliente. Además, el `MANAGER` solo puede asignarse turnos a sí mismo, mientras que el `ADMIN` tiene libertad para asignar turnos a cualquier `MANAGER`.
  * **Entrada**: hora, día, nombre del cliente, teléfono, email.
  * **Salida**: El turno es creado con el estado "Reservado" y asignado al `Manager` correspondiente. Si el cliente es nuevo, se crea un registro para él.

* **Cambiar el estado de un turno**

  * **Descripción**: El `ADMIN` y el `MANAGER` pueden cambiar el estado de un turno entre "Reservado", "Finalizado" y "Ausente". Esto permite gestionar la disponibilidad y el progreso de los turnos. El sistema permite cambiar el estado del turno a uno de los tres posibles: `Reservado`, `Finalizado` o `Ausente`, y actualizar la base de datos con la nueva información.
  * **Entrada**: ID del turno, nuevo estado.
  * **Salida**: El estado del turno se actualiza en la base de datos, reflejando el nuevo estado (Reservado, Finalizado, Ausente).

* **Eliminar un turno**

  * **Descripción**: El `ADMIN` y el `MANAGER` pueden eliminar un turno de la agenda. Esto elimina el turno de la base de datos y libera el espacio para otro turno. El sistema elimina el registro del turno y actualiza la agenda de ese `Manager` para reflejar el cambio.
  * **Entrada**: ID del turno.
  * **Salida**: El turno es eliminado y ya no aparece en la lista de turnos.

---

**Notas:**

1. **Solo el `MANAGER` puede asignarse turnos a sí mismo**. El `ADMIN` tiene la capacidad de asignar turnos a cualquier `MANAGER`.
2. El estado de los turnos es manejado por el `ADMIN` y el `MANAGER` para reflejar si el turno está **Reservado**, **Finalizado** o si el **cliente no se presenta** (**Ausente**).
3. Al crear un turno, si el número de teléfono del cliente ya está registrado, los datos del cliente se autocompletan automáticamente. Si no, se crea un nuevo cliente en el sistema.


---

### 👤 Customer (Cliente)

Representa al cliente que reserva un turno. El módulo de **Clientes** permite gestionar los datos de los clientes en el sistema, permitiendo a los `Admins` y `Managers` realizar acciones de alta, baja, modificación y consulta sobre los clientes. Los datos de los clientes incluyen su nombre, apellido, teléfono y email.

**Campos principales:**

- `id`: Identificador único.
- `firstName`, `lastName`: Nombre y apellido.
- `phoneNumber`: Teléfono (único).
- `email`: Opcional.
- `createdAt`, `updatedAt`: Timestamps.

**Relaciones:**

- 1:N con `Appointment`.

## **🔧 Funcionalidades: **

#### 👑 **ADMIN** y 🧑‍💼 **MANAGER**

* **Realizar ABM de Clientes**

  * **Descripción**: Tanto el `ADMIN` como el `MANAGER` tienen la capacidad de crear, editar y eliminar registros de clientes. Para ello, deben especificar los datos básicos del cliente: nombre, apellido, email y teléfono. El sistema permite ingresar, editar o eliminar los datos de los clientes. En caso de crear un nuevo cliente, los datos se almacenan en la base de datos.
  * **Entrada**: Nombre, apellido, email, teléfono del cliente.
  * **Salida**: El cliente es creado, modificado o eliminado correctamente en la base de datos.

* **Visualizar listado de clientes**

  * **Descripción**: El `ADMIN` y el `MANAGER` pueden consultar un listado completo de todos los clientes registrados en el sistema. Este listado incluye los datos básicos de cada cliente como su nombre, apellido, teléfono y email. El sistema obtiene todos los registros de clientes almacenados en la base de datos y los presenta en una lista organizada.
  * **Entrada**: Ninguno.
  * **Salida**: Lista de clientes con su información básica (nombre, apellido, teléfono, email).

* **Filtrar clientes por nombre, apellido, teléfono o email**

  * **Descripción**: El `ADMIN` y el `MANAGER` pueden aplicar filtros para buscar y visualizar a los clientes según su nombre, apellido, teléfono o email. Esto permite una búsqueda más precisa cuando se manejan grandes volúmenes de datos. El sistema permite realizar búsquedas con los filtros seleccionados, mostrando los resultados que coincidan con los criterios de búsqueda.
  * **Entrada**: Parámetros de búsqueda (nombre, apellido, teléfono, email).
  * **Salida**: Lista filtrada de clientes que coinciden con los parámetros de búsqueda.


**Notas:**

* La gestión de clientes incluye la posibilidad de realizar modificaciones completas de los datos o eliminarlos, y está restringida solo a `Admins` y `Managers` para garantizar que la información sea gestionada de manera controlada.
* La búsqueda de clientes puede realizarse de manera individual por cada campo, permitiendo una mayor flexibilidad.

---

## 🧭 Enums definidos

### `EUserRole`

Define el rol del usuario en el sistema:
- `ADMIN`
- `MANAGER`

### `AppointmentStatus`

Define el estado de un turno:
- `RESERVADO`: Turno reservado, pendiente de atención (amarillo).
- `TERMINADO`: Turno finalizado correctamente (verde).
- `AUSENTE`: El cliente no asistió (rojo).

### `EDayOfWeek`

Representa los días de la semana:
- `LUNES`, `MARTES`, `MIÉRCOLES`, `JUEVES`, `VIERNES`, `SÁBADO`, `DOMINGO`

