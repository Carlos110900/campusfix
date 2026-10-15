
# CampusFix

## Sistema de Gestión de Incidencias Universitarias

CampusFix es una API REST desarrollada para registrar,
consultar y administrar incidencias de mantenimiento
dentro de una universidad.

## Objetivo

Centralizar los reportes de problemas en instalaciones
universitarias y permitir el seguimiento de su estado.

## Tecnologías utilizadas

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- Docker
- PowerShell

## Arquitectura

El Backend utiliza una arquitectura por capas:

- Routes: Define los endpoints.
- Controllers: Valida solicitudes y genera respuestas.
- Services: Ejecuta la lógica del negocio.
- Models: Gestiona la persistencia mediante Mongoose.
- MongoDB: Almacena las incidencias.

## Funcionalidades implementadas

### Feature 1: Registrar incidencias

Permite registrar un problema de mantenimiento.

Método: POST

Endpoint: /api/incidents

Ejemplo de request:

```json
{
  "title": "Proyector dañado",
  "description": "El proyector no enciende correctamente.",
  "location": "Edificio A, salon 205",
  "category": "electricidad",
  "priority": "alta"
}
```

Respuestas:
- 201: Incidencia registrada.
- 400: Datos inválidos.
- 500: Error interno.

### Feature 2: Consultar incidencias

Permite consultar todas las incidencias o filtrarlas.

Método: GET

Endpoints:
- /api/incidents
- /api/incidents?status=pendiente
- /api/incidents?status=en_proceso
- /api/incidents?status=resuelta

Respuestas:
- 200: Consulta exitosa.
- 400: Filtro inválido.
- 500: Error interno.

### Feature 3: Actualizar estados

Permite modificar el estado de una incidencia.

Método: PATCH

Endpoint: /api/incidents/:id/status

Ejemplo de request:

```json
{
  "status": "en_proceso"
}
```

Estados permitidos:
- pendiente
- en_proceso
- resuelta

Respuestas:
- 200: Estado actualizado.
- 400: ID o estado inválido.
- 404: Incidencia inexistente.
- 500: Error interno.

## Requisitos

- Node.js y npm
- Docker Desktop
- Git

MongoDB Compass es opcional para visualizar los datos.

## Instalación y ejecución

### 1. Clonar repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd campusfix
```

Reemplazar la URL por la dirección del repositorio publicado.

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copiar `.env.example` a un nuevo archivo `.env`.

Configuración local:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27019/campusfix
```

### 4. Iniciar MongoDB

Con Docker Desktop funcionando:

```bash
docker run -d --name campusfix-mongo -p 127.0.0.1:27019:27017 -v campusfix-mongo-data:/data/db mongo:7
```

Si el contenedor ya existe y está detenido:

```bash
docker start campusfix-mongo
```

### 5. Ejecutar CampusFix

Modo desarrollo:

```bash
npm run dev
```

Compilar TypeScript:

```bash
npm run build
```

Ejecutar versión compilada:

```bash
npm start
```

## Verificar funcionamiento

Abrir en el navegador:

http://localhost:3000/api/health

Respuesta esperada:

```json
{
  "status": "OK",
  "service": "CampusFix",
  "message": "El servidor funciona correctamente"
}
```

## Base de datos

Base de datos: campusfix

Colección: incidents

MongoDB almacena los reportes con sus datos,
prioridad, estado y fechas de creación y actualización.

## Seguridad y configuración

El archivo `.env` no debe subirse a GitHub.

La primera versión está destinada a desarrollo local
y no implementa autenticación.

## Funcionalidades futuras

- Autenticación de usuarios.
- Roles y permisos.
- Subida de imágenes.
- Notificaciones.
- Historial de incidencias.
- Pruebas automatizadas.
- Despliegue del Backend.

## Estado del proyecto

Entregable 1: Primera versión funcional con tres
features implementadas y probadas.
