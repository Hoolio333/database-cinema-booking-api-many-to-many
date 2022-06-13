const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seed() {
  const customer = await createCustomer();
  const movies = await createMovies();
  const screens = await createScreens();
  const screenings = await createScreenings(screens, movies);
  const seat = await createSeat(screens);
  await createTicket(seat, screenings, customer);
  process.exit(0);
}

async function createCustomer() {
  const customer = await prisma.customer.create({
    data: {
      name: "Alice",
      contact: {
        create: {
          email: "alice@boolean.co.uk",
          phone: "1234567890",
        },
      },
    },
    include: {
      contact: true,
    },
  });

  console.log("Customer created", customer);

  return customer;
}

async function createMovies() {
  const rawMovies = [
    { title: "The Matrix", runtimeMins: 120 },
    { title: "Dodgeball", runtimeMins: 154 },
  ];

  const movies = [];

  for (const rawMovie of rawMovies) {
    const movie = await prisma.movie.create({ data: rawMovie });
    movies.push(movie);
  }

  console.log("Movies created", movies);

  return movies;
}

async function createScreens() {
  const rawScreens = [{ number: 1 }, { number: 2 }];

  const screens = [];

  for (const rawScreen of rawScreens) {
    const screen = await prisma.screen.create({
      data: rawScreen,
    });

    console.log("Screen created", screen);

    screens.push(screen);
  }

  return screens;
}

async function createScreenings(screens, movies) {
  const screeningDate = new Date();
  const screenings = [];
  for (const screen of screens) {
    for (let i = 0; i < movies.length; i++) {
      screeningDate.setDate(screeningDate.getDate() + i);

      const screening = await prisma.screening.create({
        data: {
          startsAt: screeningDate,
          movie: {
            connect: {
              id: movies[i].id,
            },
          },
          screen: {
            connect: {
              id: screen.id,
            },
          },
        },
      });
      screenings.push(screening);
    }
  }
  return screenings;
}

const createSeat = async (screens) => {
  return await prisma.seat.create({
    data: {
      number: 4,
      row: "A",
      Screen: {
        connect: {
          id: screens[1].id,
        },
      },
    },
  });
};

const createTicket = async (seat, screenings, customer) => {
  return await prisma.ticket.create({
    data: {
      screening: {
        connect: {
          id: screenings[0].id,
        },
      },
      seats: {
        connect: {
          id: seat.id,
        },
      },
      customer: {
        connect: {
          id: customer.id,
        },
      },
    },
    include: {
      seats: true,
    },
  });
};

seed()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  })
  .finally(() => process.exit(1));
