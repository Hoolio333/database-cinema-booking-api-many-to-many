const { prisma, prismaNoLog } = require("./src/utils/prisma");

// Choose prismaNoLog if you don't want SQL queries logged
const db = prisma;

async function query() {
  const seats = await db.seat.findMany({
    where: {
      Screen: {
        number: 2,
      },
    },
    include: {
      Screen: true,
      tickets: {
        include: {
          customer: {
            include: {
              contact: true,
            },
          },
        },
      },
    },
  });

  seats.forEach((seat, index) => {
    console.log(
      `\nSeat #${index} id=${seat.id}: ${seat.row}, screen: ${seat.Screen.number}`
    );
    if (seat.tickets) {
      console.log(`Tickets: `, JSON.stringify(seat.tickets, null, 2));
    }
  });

  // Don't edit any of the code below this line
  process.exit(0);
}

query().catch(async (error) => {
  console.error(error);
  await db.$disconnect();
  process.exit(1);
});
