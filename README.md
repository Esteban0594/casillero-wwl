# Casillero WWL By Aduana WWL

Sistema de gestión de casillero en Costa Rica para importación de productos desde otros países.

## Características

- Autenticación JWT segura
- Panel de administración completo
- Portal de clientes
- Gestión de paquetes
- Base de datos MongoDB
- Interfaz moderna con React y Tailwind CSS

## Credenciales de Administrador

- **Email:** admin@casillerowl.com
- **Contraseña:** AdminWWL2024!

## Instalación

### Requisitos Previos

- Node.js (v16 o superior)
- MongoDB (local o MongoDB Atlas)
- npm o yarn

### Backend

1. Navega a la carpeta del backend:
```bash
cd backend
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno en `.env`:
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/casillero_wwl
JWT_SECRET=tu_secreto_jwt_aqui
```

4. Crea el usuario administrador:
```bash
node seeder.js
```

5. Inicia el servidor:
```bash
npm run dev
```

### Frontend

1. Navega a la carpeta del frontend:
```bash
cd frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Abre tu navegador en: `http://localhost:5173`

## Estructura del Proyecto

```
CASILLERO/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── auth.js
│   ├── server.js
│   ├── seeder.js
│   └── .env
├── frontend/
│   ├── public/
│   │   └── img/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## Rutas de la API

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual (requiere token)

### Administración (requiere token de admin)
- `GET /api/auth/users` - Listar todos los clientes
- `GET /api/auth/users/:id` - Obtener usuario por ID
- `PUT /api/auth/users/:id` - Actualizar usuario
- `DELETE /api/auth/users/:id` - Eliminar usuario

## Rutas del Frontend

### Públicas
- `/login` - Página de inicio de sesión
- `/register` - Página de registro

### Administración (`/admin/*`)
- `/admin` - Dashboard principal
- `/admin/clientes` - Gestión de clientes
- `/admin/paquetes` - Gestión de paquetes
- `/admin/reportes` - Reportes
- `/admin/notificaciones` - Notificaciones
- `/admin/configuracion` - Configuración

### Portal de Clientes (`/portal/*`)
- `/portal` - Inicio del portal
- `/portal/mis-paquetes` - Lista de paquetes
- `/portal/rastreo` - Rastreo de paquetes
- `/portal/facturas` - Facturas
- `/portal/mi-cuenta` - Mi cuenta
- `/portal/ayuda` - Centro de ayuda

## Próximos Pasos

- [ ] Integración con Google OAuth
- [ ] Sistema de notificaciones por email
- [ ] Rastreo en tiempo real de paquetes
- [ ] Sistema de pagos
- [ ] Generación de reportes PDF
- [ ] API de integración con servicios de envío

## Tecnologías Utilizadas

### Backend
- Node.js
- Express.js
- MongoDB con Mongoose
- JSON Web Tokens (JWT)
- bcryptjs para encriptación

### Frontend
- React 18
- React Router Dom
- Axios
- Tailwind CSS
- React Icons
- React Toastify

## Soporte

Para soporte técnico, contactar a: soporte@casillerowl.com

## Licencia

© 2024 Casillero WWL By Aduana WWL. Todos los derechos reservados.
