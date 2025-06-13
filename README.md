# Aplicación de Turismo

Esta es una aplicación web para la gestión de tours y servicios turísticos, desarrollada con React y Node.js.

## Características

- Autenticación de usuarios (clientes y gerentes de ventas)
- Catálogo de tours y servicios turísticos
- Carrito de compras
- Gestión de órdenes
- Panel de administración para gerentes de ventas

## Tecnologías Utilizadas

### Frontend
- React
- React Router
- Axios
- Tailwind CSS
- Context API

### Backend
- Node.js
- Express
- Prisma
- MySQL
- JWT para autenticación

## Requisitos Previos

- Node.js (v14 o superior)
- MySQL
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd turismo-app
```

2. Instalar dependencias del backend:
```bash
cd backend
npm install
```

3. Configurar variables de entorno:
Crear un archivo `.env` en la carpeta `backend` con el siguiente contenido:
```
DATABASE_URL="mysql://root:root@localhost:3306/turismo_db"
JWT_SECRET="tu_clave_secreta_muy_segura"
PORT=3000
```

4. Inicializar la base de datos:
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

5. Instalar dependencias del frontend:
```bash
cd ../frontend
npm install
```

## Ejecución

1. Iniciar el servidor backend:
```bash
cd backend
npm run dev
```

2. Iniciar el servidor frontend:
```bash
cd frontend
npm run dev
```

La aplicación estará disponible en:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Usuarios de Prueba

### Gerente de Ventas
- Email: admin@example.com
- Contraseña: admin123

### Cliente
- Email: client@example.com
- Contraseña: client123

## Estructura del Proyecto

```
turismo-app/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── index.js
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## API Endpoints

### Autenticación
- POST /api/auth/register - Registro de usuarios
- POST /api/auth/login - Inicio de sesión
- GET /api/auth/me - Obtener información del usuario actual

### Productos
- GET /api/products - Obtener todos los productos
- GET /api/products/:id - Obtener un producto específico
- POST /api/products - Crear un nuevo producto (SALES_MANAGER)
- PUT /api/products/:id - Actualizar un producto (SALES_MANAGER)
- DELETE /api/products/:id - Eliminar un producto (SALES_MANAGER)

### Carrito
- GET /api/cart - Obtener el carrito del usuario
- POST /api/cart - Agregar producto al carrito
- PUT /api/cart/:id - Actualizar cantidad de producto
- DELETE /api/cart/:id - Eliminar producto del carrito
- DELETE /api/cart - Vaciar carrito

### Órdenes
- POST /api/orders - Crear una nueva orden
- GET /api/orders/my-orders - Obtener órdenes del usuario
- GET /api/orders - Obtener todas las órdenes (SALES_MANAGER)
- PUT /api/orders/:id/status - Actualizar estado de orden (SALES_MANAGER)
- DELETE /api/orders/:id/cancel - Cancelar orden

## Contribución

1. Fork el repositorio
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles. 