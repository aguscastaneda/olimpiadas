# E-commerce Platform

Una plataforma de comercio electrónico desarrollada con React, Node.js y Prisma.

## Características

- Autenticación de usuarios (registro, login, sesión persistente)
- Gestión de productos (CRUD)
- Carrito de compras
- Proceso de checkout
- Integración con MercadoPago
- Panel de administración
- Gestión de órdenes

## Tecnologías Utilizadas

### Frontend
- React
- React Router
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express
- Prisma (ORM)
- MySQL
- JWT para autenticación
- MercadoPago SDK

## Requisitos Previos

- Node.js (v14 o superior)
- MySQL
- Cuenta de MercadoPago (para pagos)

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd <nombre-del-directorio>
```

2. Instalar dependencias del backend:
```bash
cd backend
npm install
```

3. Instalar dependencias del frontend:
```bash
cd frontend
npm install
```

4. Configurar variables de entorno:
   - Crear archivo `.env` en la carpeta `backend` con las siguientes variables:
   ```
   DATABASE_URL="mysql://usuario:contraseña@localhost:3306/nombre_db"
   JWT_SECRET="tu_secreto_jwt"
   MERCADOPAGO_ACCESS_TOKEN="tu_token_mercadopago"
   FRONTEND_URL="http://localhost:5173"
   BACKEND_URL="http://localhost:3000"
   ```

5. Ejecutar migraciones de la base de datos:
```bash
cd backend
npx prisma migrate dev
```

## Ejecución

1. Iniciar el backend:
```bash
cd backend
npm run dev
```

2. Iniciar el frontend:
```bash
cd frontend
npm run dev
```

## Estructura del Proyecto

```
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── index.js
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   └── App.jsx
    └── package.json
```

## Roles de Usuario

- **CLIENT**: Usuario regular que puede comprar productos
- **SALES_MANAGER**: Administrador que puede gestionar productos y órdenes

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Base de datos

La base de datos que utiliza el sistema se llama @olimpiadas.sql" y esta ubicada en:
"C:\Users\agust\OneDrive\Documentos"