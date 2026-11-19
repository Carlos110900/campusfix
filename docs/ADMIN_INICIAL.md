
# CampusFix - Configuracion del administrador inicial

## Objetivo

Documentar cómo configurar el primer administrador
de CampusFix en una instalación local nueva.

Este procedimiento se utiliza solamente durante
la configuración inicial del sistema.

## 1. Registrar un usuario

Iniciar CampusFix y registrar una cuenta mediante:

POST /api/auth/register

El usuario se crea automáticamente con el rol:

reportante

No se permite seleccionar el rol administrador
desde el registro público.

## 2. Abrir MongoDB

En PowerShell ejecutar:

docker exec -it campusfix-mongo mongosh campusfix

## 3. Comprobar administradores existentes

Ejecutar:

db.users.countDocuments({ role: "administrador" })

Para una instalación nueva, el resultado debe ser 0.

Si ya existe un administrador, no repetir el
procedimiento de inicialización.

## 4. Configurar el primer administrador

Utilizar el correo del usuario registrado:

db.users.updateOne(
  {
    email: "correo_del_administrador@ejemplo.com",
    role: "reportante"
  },
  {
    $set: { role: "administrador" }
  }
)

Reemplazar el correo de ejemplo por el correo real.

La operación debe realizarse únicamente por
la persona responsable de configurar la base
de datos.

## 5. Verificar el administrador

Ejecutar:

db.users.find(
  { role: "administrador" },
  { _id: 0, name: 1, email: 1, role: 1 }
)

Comprobar que aparezca la cuenta administrativa.

## 6. Iniciar sesión

Utilizar:

POST /api/auth/login

Con el correo y la contraseña del administrador.

La API deberá devolver un JWT y el rol administrador.

## Consideraciones de seguridad

- No guardar contraseñas en GitHub.
- No permitir elegir administrador en el registro público.
- No modificar directamente las contraseñas de MongoDB.
- Ejecutar la inicialización solo en un entorno controlado.
- No repetir el procedimiento si ya existe un administrador.
- En producción, habilitar autenticación de MongoDB y
  restringir el acceso a la base de datos.

Este procedimiento corresponde al entorno local
de desarrollo de CampusFix.
