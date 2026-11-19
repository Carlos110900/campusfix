
# CampusFix

## Sistema de Gestión de Incidencias Universitarias

CampusFix es una API REST desarrollada con Node.js,
Express, TypeScript y MongoDB.

Su objetivo es registrar, consultar y dar seguimiento
a las incidencias de mantenimiento dentro de una
universidad.

## Objetivo

Centralizar los reportes de problemas en las
instalaciones universitarias y permitir su seguimiento
mediante usuarios, responsables, estados y comentarios.

## Tecnologías utilizadas

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- Docker
- bcryptjs
- JSON Web Token (JWT)
- PowerShell
- MongoDB Compass

## Arquitectura

El backend utiliza una arquitectura por capas:

- Routes: Definen los endpoints.
- Middleware: Verifica autenticación y permisos.
- Controllers: Validan las solicitudes HTTP.
- Services: Contienen la lógica del negocio.
- Models: Gestionan los datos con Mongoose.
- MongoDB: Almacena la información.

## Funcionalidades implementadas

### Feature 1: Registrar incidencias

Permite registrar problemas de mantenimiento.

Método: POST

Endpoint: /api/incidents

Requiere autenticación JWT.

Ejemplo de solicitud:

```json
{
  "title": "Lampara dañada",
  "description": "La lampara del salon 101 no enciende.",
  "location": "Edificio A, salon 101",
  "category": "electricidad",
  "priority": "media"
}
```

La incidencia se crea con estado `pendiente`.

Respuestas principales:

- 201: Incidencia registrada.
- 400: Datos inválidos.
- 401: Token ausente o inválido.
- 500: Error interno.

### Feature 2: Consultar incidencias

Permite consultar incidencias y filtrarlas por estado.

Método: GET

Endpoints:

- /api/incidents
- /api/incidents?status=pendiente
- /api/incidents?status=en_proceso
- /api/incidents?status=resuelta

Requiere autenticación JWT.

Respuestas principales:

- 200: Consulta correcta.
- 400: Filtro inválido.
- 401: Sin autenticación.
- 500: Error interno.

### Feature 3: Actualizar estado

Permite modificar el estado de una incidencia.

Método: PATCH

Endpoint: /api/incidents/:id/status

Requiere autenticación JWT y permisos.

Ejemplo:

```json
{
  "status": "en_proceso"
}
```

Transiciones permitidas:

- pendiente -> en_proceso
- en_proceso -> resuelta
- resuelta -> estado final

No se permite regresar a estados anteriores
ni saltar directamente de pendiente a resuelta.

Permisos:

- Administrador: Puede modificar cualquier incidencia.
- Mantenimiento: Solo incidencias asignadas.
- Reportante: No puede modificar estados.

La actualización comprueba el estado anterior
para evitar cambios conflictivos.

Respuestas principales:

- 200: Estado actualizado.
- 400: Datos inválidos.
- 401: Sin autenticación.
- 403: Sin permisos.
- 404: Incidencia inexistente.
- 409: Transición no permitida o conflicto.
- 500: Error interno.

### Feature 4: Registro e inicio de sesión

Permite registrar usuarios e iniciar sesión.

#### Registro

Método: POST

Endpoint: /api/auth/register

Ejemplo:

```json
{
  "name": "Usuario Ejemplo",
  "email": "usuario@ejemplo.com",
  "password": "ContraseñaDeEjemplo123!"
}
```

Los usuarios nuevos reciben automáticamente
el rol `reportante`.

Las contraseñas se almacenan mediante hash
con bcrypt.

Respuestas principales:

- 201: Registro correcto.
- 400: Datos inválidos.
- 409: Correo duplicado.
- 500: Error interno.

#### Inicio de sesión

Método: POST

Endpoint: /api/auth/login

Ejemplo:

```json
{
  "email": "usuario@ejemplo.com",
  "password": "ContraseñaDeEjemplo123!"
}
```

Si las credenciales son correctas, el servidor
devuelve un token JWT válido durante 2 horas.

Respuestas principales:

- 200: Inicio de sesión correcto.
- 400: Datos incompletos.
- 401: Credenciales incorrectas.
- 500: Error interno.

### Feature 5: Asignación de incidencias

Permite que un administrador asigne incidencias
a usuarios de mantenimiento.

Método: PATCH

Endpoint: /api/incidents/:id/assign

Requiere un token JWT de administrador.

Ejemplo de solicitud:

```json
{
  "userId": "ID_DEL_TECNICO"
}
```

El usuario asignado debe tener rol `mantenimiento`.

El identificador se guarda en el campo `assignedTo`
de la incidencia.

Respuestas principales:

- 200: Asignación correcta.
- 400: Datos inválidos o usuario sin rol adecuado.
- 401: Sin autenticación.
- 403: No es administrador.
- 404: Incidencia o usuario inexistente.
- 500: Error interno.

### Feature 6: Comentarios de seguimiento

Permite registrar y consultar comentarios
relacionados con las incidencias.

Ambas operaciones requieren autenticación JWT.

#### Agregar comentario

Método: POST

Endpoint: /api/incidents/:id/comments

Ejemplo:

```json
{
  "text": "Se reviso el equipo y necesita mantenimiento."
}
```

El comentario debe tener entre 3 y 500 caracteres.

El autor se identifica automáticamente mediante
el usuario autenticado.

Respuestas principales:

- 201: Comentario registrado.
- 400: Datos inválidos.
- 401: Sin autenticación.
- 404: Incidencia inexistente.
- 500: Error interno.

#### Consultar comentarios

Método: GET

Endpoint: /api/incidents/:id/comments

Devuelve los comentarios de una incidencia,
ordenados del más antiguo al más reciente.

También muestra el nombre y rol de cada autor.

Respuestas principales:

- 200: Consulta correcta.
- 400: ID inválido.
- 401: Sin autenticación.
- 404: Incidencia inexistente.
- 500: Error interno.

## Roles y permisos

CampusFix utiliza tres roles:

- reportante
- mantenimiento
- administrador

| Operación | Reportante | Mantenimiento | Administrador |
|---|---|---|---|
| Registrar incidencia | Sí | Sí | Sí |
| Consultar incidencias | Sí | Sí | Sí |
| Asignar responsable | No | No | Sí |
| Cambiar estado | No | Solo asignadas | Sí |
| Agregar comentario | Sí | Sí | Sí |
| Consultar comentarios | Sí | Sí | Sí |

Las incidencias y comentarios son visibles
para usuarios autenticados.

El backend comprueba los permisos mediante
middlewares y consultas a MongoDB.

## Requisitos

- Node.js y npm
- Docker Desktop
- Git
- Visual Studio Code (recomendado)
- MongoDB Compass (opcional)

## Instalación

### 1. Clonar el repositorio

```powershell
git clone https://github.com/Carlos110900/campusfix.git
cd campusfix
```

### 2. Instalar dependencias

En PowerShell:

```powershell
npm.cmd ci
```

### 3. Configurar variables de entorno

Crear `.env` a partir de `.env.example`:

```powershell
Copy-Item .env.example .env
```

Configuración local:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27019/campusfix
JWT_SECRET=REEMPLAZAR_CON_CLAVE_PRIVADA
```

Reemplazar `JWT_SECRET` por una clave secreta
aleatoria y privada.

No publicar `.env` en GitHub.

### 4. Iniciar MongoDB

Primero, abrir Docker Desktop.

Si el contenedor no existe:

```powershell
docker run -d --name campusfix-mongo -p 127.0.0.1:27019:27017 -v campusfix-mongo-data:/data/db mongo:7
```

Si el contenedor ya existe:

```powershell
docker start campusfix-mongo
```

Para verificar:

```powershell
docker ps
```

### 5. Ejecutar CampusFix

Modo desarrollo:

```powershell
npm.cmd run dev
```

Compilar TypeScript:

```powershell
npm.cmd run build
```

Ejecutar versión compilada:

```powershell
npm.cmd start
```

El servidor utiliza el puerto 3000
de manera predeterminada.

## Verificar funcionamiento

Con el servidor funcionando, abrir:

http://localhost:3000/api/health

Respuesta esperada:

```json
{
  "status": "OK",
  "service": "CampusFix",
  "message": "El servidor funciona correctamente"
}
```

## Ejemplo de autenticación con PowerShell

### Iniciar sesión

```powershell
$body = @{
    email = "usuario@ejemplo.com"
    password = "CONTRASEÑA_DEL_USUARIO"
} | ConvertTo-Json

$login = Invoke-RestMethod `
    -Uri "http://localhost:3000/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body

$token = $login.token
```

Usar credenciales de una cuenta registrada.

### Consultar incidencias con JWT

```powershell
Invoke-RestMethod `
    -Uri "http://localhost:3000/api/incidents" `
    -Method GET `
    -Headers @{ Authorization = "Bearer $token" }
```

El token debe enviarse mediante el encabezado:

Authorization: Bearer TOKEN_JWT

## Administrador inicial

Los usuarios registrados públicamente reciben
el rol `reportante`.

Para configurar el primer administrador
en una instalación local, consultar:

[Configuración del administrador inicial](docs/ADMIN_INICIAL.md)

El procedimiento requiere acceso controlado
a la base de datos.

No permite elegir el rol administrador
durante el registro público.

## Base de datos

Base de datos: `campusfix`

Colecciones utilizadas:

- incidents: Incidencias y responsables.
- users: Usuarios, contraseñas con hash y roles.
- comments: Comentarios de seguimiento.

Cada comentario está relacionado con
una incidencia y un usuario.

## Seguridad

- Las contraseñas se almacenan con bcrypt.
- Se utilizan tokens JWT.
- Las rutas de incidencias requieren autenticación.
- Solo administradores pueden asignar responsables.
- Los técnicos solo pueden cambiar estados
  de incidencias asignadas.
- Se validan las transiciones entre estados.
- Se comprueba el estado anterior durante
  la actualización en MongoDB.
- No se deben publicar contraseñas ni tokens.
- El archivo `.env` debe permanecer fuera de Git.

El entorno actual utiliza MongoDB local.
Para producción se requiere configurar
autenticación de MongoDB, permisos y
restricciones de acceso adicionales.

## Pruebas realizadas

Se utilizaron PowerShell y MongoDB Compass.

Resultados principales:

| Prueba | Resultado |
|---|---|
| Registrar incidencia sin JWT | HTTP 401 |
| Registrar incidencia con JWT | HTTP 201 |
| Reportante cambia estado | HTTP 403 |
| Administrador cambia estado permitido | HTTP 200 |
| Transición no permitida | HTTP 409 |
| Técnico asignado cambia estado | HTTP 200 |
| Técnico no asignado cambia estado | HTTP 403 |
| Asignación administrativa | HTTP 200 |
| Crear comentario | HTTP 201 |
| Consultar comentarios | HTTP 200 |
| Consultar comentarios sin JWT | HTTP 401 |
| Comentario inválido | HTTP 400 |

Se verificó la persistencia de incidencias,
usuarios, asignaciones y comentarios en MongoDB.

## Estado del proyecto

### Entregable 1

Se desarrollaron tres funcionalidades:

1. Registrar incidencias.
2. Consultar incidencias.
3. Actualizar estados.

### Entregable 2

Se incorporaron tres funcionalidades nuevas:

4. Registro e inicio de sesión.
5. Asignación de incidencias.
6. Comentarios de seguimiento.

También se realizaron correcciones de
autenticación, permisos y transiciones de estado.

El proyecto corresponde a una versión
incremental de desarrollo.

El porcentaje de avance total se determinará
según el alcance y las funcionalidades
establecidas para el proyecto integrador.

## Repositorio

https://github.com/Carlos110900/campusfix
