const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Crear usuario administrador
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Administrador',
      password: adminPassword,
      role: 'SALES_MANAGER',
    },
  });

  // Crear usuario cliente
  const clientPassword = await bcrypt.hash('client123', 10);
  const client = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      email: 'client@example.com',
      name: 'Cliente',
      password: clientPassword,
      role: 'CLIENT',
    },
  });

  // Crear productos de ejemplo
  const products = [
    {
      name: 'Tour Machu Picchu',
      description: 'Visita guiada a Machu Picchu con transporte y almuerzo incluido',
      price: 150.00,
      stock: 20,
      image: 'https://example.com/machu-picchu.jpg',
    },
    {
      name: 'Tour Valle Sagrado',
      description: 'Recorrido por el Valle Sagrado de los Incas',
      price: 80.00,
      stock: 15,
      image: 'https://example.com/valle-sagrado.jpg',
    },
    {
      name: 'Tour Cusco City',
      description: 'Tour por la ciudad de Cusco y sus principales atractivos',
      price: 50.00,
      stock: 30,
      image: 'https://example.com/cusco-city.jpg',
    },
  ];

  // Primero eliminamos todos los productos existentes
  await prisma.product.deleteMany();

  // Luego creamos los nuevos productos
  await prisma.product.createMany({
    data: products,
  });

  console.log('Base de datos inicializada con datos de prueba');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 