const { PrismaClient } = require('@prisma/client')

const database = new PrismaClient()

console.log('Database connect')

module.exports = database