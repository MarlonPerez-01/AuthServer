# API REST para autenticación y autorización

API REST encargada de autenticar y autorizar usuarios por medio de JSON Web Tokens escrita en typescript utilizando el framework Express.

## Empezando

### Dependencias

- [Mysql](https://www.mysql.com/)
- [NodeJS](https://nodejs.org/en/)

### Configuración

- Clonar este repositorio

```sh
git clone https://github.com/MarlonPerez-01/AuthServer.git
```

- Navegar al directorio del proyecto

- Ejecutar `npm install` o `npm i` para la instalación de dependencias.

- Crear el archivo `.env` y copiar el contenido del archivo `.env.sample` y asignar los valores a cada variable.

- Crear la base de datos en MySQL a partir del script database.sql

### Ejecutar

- Ejecutar `npm run dev` para iniciar la aplicación en modo de desarrollo.

## Estructura del proyecto

    .
    ├── ...
    ├── src                             # Dentro se encuentran los ficheros fuentes
    │   ├── config                      # Configuración y conexión a la base de datos
    │   ├── controllers                 # Controladores
    │   ├── helpers                     # Funciones para resolver tareas específicas
    │   ├── interfaces                  # Definición de interfaces
    │   ├── middlewares                 # Middlewares
    │   ├── models                      # Queries a la base de datos
    │   ├── routes                      # Rutas de la API
    │   ├── types                       # Definición de tipado
    │   ├── validations                 # Esquemas a validar
    │   ├── app.ts                      # Llamadas a las funciones principales
    │   └── server.ts                   # Llamadas a middlewares generales
    ├── .env                            # Fichero de variables de entorno
    ├── .env.sample                     # Fichero de variables de entorno de ejemplo
    ├── .gitignore                      # Fichero para ignorar archivos en github
    ├── .prettierrc                     # Configuración del formato de código
    ├── error.log                       # Fichero de logs del servidor
    ├── package-lock.json               # Mantener versión de cada paquete
    ├── package.json                    # Información del proyecto, scripts y dependencias
    ├── README.md                       # Documentación
    ├── tsconfig.json                   # Configuración de typescript
    └── ...

## Endpoints

### GET

`/usuarios/:id`

### POST

`/auth/signup`\
`/auth/signin`\
`/auth/verify-email`\
`/auth/refresh-token`\
`/auth/logout`\
`/auth/change-password`\
`/auth/forgot-password`\
`/auth/reset-password`\
`/auth/resend-verification-email`

### PUT

`/usuarios/:id`
