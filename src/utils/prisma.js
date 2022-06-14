const { PrismaClient } = require("@prisma/client");

let logLevel = {
  log: ["query"],
};

if (process.env.NODE_ENV === "test") {
  logLevel = {};
}
const prisma = new PrismaClient(logLevel);

const prismaNoLog = new PrismaClient();

module.exports = { prisma, prismaNoLog };
