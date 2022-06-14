const { prisma, prismaNoLog } = require("./utils/prisma");

const getByScreenId = async (req, res) => {
  const { screenId } = req.params;

  const allSeats = await prisma.seat.findMany({
    where: {
      screenId: Number(screenId),
    },
  });

  res.json({ data: allSeats });
};

const createTicket = async (req, res) => {
  const { screeningId, customerId, seatIds } = req.body;

  const createdTicket = await prisma.ticket.create({
    data: {
      screeningId: screeningId,
      customerId: customerId,
    },
  });

  await prisma.ticketSeats.createMany({
    data: seatIds.map((id) => {
      return {
        seatId: id,
        ticketId: createdTicket.id,
      };
    }),
  });

  const ticket = await prisma.ticket.findFirst({
    where: {
      id: createdTicket.id,
    },
    include: {
      seats: {
        include: {
          seat: true,
        },
      },
    },
  });

  res.json({ data: ticket });
};

module.exports = {
  getByScreenId,
  createTicket,
};
