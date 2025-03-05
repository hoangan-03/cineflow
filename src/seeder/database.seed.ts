import { DataSource } from "typeorm";
import { faker } from "@faker-js/faker";
import { User } from "@/entities/user.entity";
import { Setting } from "@/entities/setting.entity";
import { Gender } from "@/modules/user/enums/gender.enum";
import { SettingType } from "@/modules/user/enums/setting.enum";
import { PaymentMethods } from "@/entities/payment-methods.entity";
import { PaymentMethodType } from "@/modules/user/enums/payment-method.enum";
import { Movie } from "@/entities/movie.entity";
import { Cinema } from "@/entities/cinema.entity";
import { Theater } from "@/entities/theater.entity";
import { Seat } from "@/entities/seat.entity";
import { Screening } from "@/entities/screening.entity";
import { Booking } from "@/entities/booking.entity";
import { BookedSeat } from "@/entities/booked-seat.entity";
import { Review } from "@/entities/review.entity";
import { Genre } from "@/entities/genre.entity";
import { UserStatus } from "@/entities/user-status.entity";
import { BookingStatus } from "@/modules/booking/enums/booking-status.enum";

// Sample data

const movieGenres = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Western",
];

const movieData = [
  {
    title: "Inception",
    description:
      "A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea into the mind of a CEO.",
    director: "Christopher Nolan",
    durationMinutes: 148,
    releaseDate: new Date("2010-07-16"),
    posterUrl: "https://example.com/inception_poster.jpg",
    trailerUrl: "https://example.com/inception_trailer.mp4",
    genreNames: ["Action", "Sci-Fi", "Thriller"],
  },
  {
    title: "The Shawshank Redemption",
    description:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    director: "Frank Darabont",
    durationMinutes: 142,
    releaseDate: new Date("1994-09-23"),
    posterUrl: "https://example.com/shawshank_poster.jpg",
    trailerUrl: "https://example.com/shawshank_trailer.mp4",
    genreNames: ["Drama"],
  },
  {
    title: "The Godfather",
    description:
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    director: "Francis Ford Coppola",
    durationMinutes: 175,
    releaseDate: new Date("1972-03-24"),
    posterUrl: "https://example.com/godfather_poster.jpg",
    trailerUrl: "https://example.com/godfather_trailer.mp4",
    genreNames: ["Crime", "Drama"],
  },
  {
    title: "Pulp Fiction",
    description:
      "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    director: "Quentin Tarantino",
    durationMinutes: 154,
    releaseDate: new Date("1994-10-14"),
    posterUrl: "https://example.com/pulpfiction_poster.jpg",
    trailerUrl: "https://example.com/pulpfiction_trailer.mp4",
    genreNames: ["Crime", "Drama"],
  },
  {
    title: "Forrest Gump",
    description:
      "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.",
    director: "Robert Zemeckis",
    durationMinutes: 142,
    releaseDate: new Date("1994-07-06"),
    posterUrl: "https://example.com/forrestgump_poster.jpg",
    trailerUrl: "https://example.com/forrestgump_trailer.mp4",
    genreNames: ["Drama", "Romance"],
  },
  {
    title: "The Dark Knight",
    description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    director: "Christopher Nolan",
    durationMinutes: 152,
    releaseDate: new Date("2008-07-18"),
    posterUrl: "https://example.com/darkknight_poster.jpg",
    trailerUrl: "https://example.com/darkknight_trailer.mp4",
    genreNames: ["Action", "Crime", "Drama"],
  },
];

const cinemaData = [
  {
    name: "Cineworld Downtown",
    address: "123 Main Street, Downtown, NY 10001",
    phoneNumber: "+1234567890",
    imageUrl: "https://example.com/cineworld_downtown.jpg",
    hasParking: true,
    hasFoodCourt: true,
  },
  {
    name: "Starlight Cinema",
    address: "456 Broadway, West End, NY 10002",
    phoneNumber: "+1234567891",
    imageUrl: "https://example.com/starlight.jpg",
    hasParking: true,
    hasFoodCourt: false,
  },
  {
    name: "Landmark Theaters",
    address: "789 Oak Avenue, East Side, NY 10003",
    phoneNumber: "+1234567892",
    imageUrl: "https://example.com/landmark.jpg",
    hasParking: false,
    hasFoodCourt: true,
  },
  {
    name: "Regal Cinemas",
    address: "101 Pine Street, North Side, NY 10004",
    phoneNumber: "+1234567893",
    imageUrl: "https://example.com/regal.jpg",
    hasParking: true,
    hasFoodCourt: true,
  },
  {
    name: "AMC Theaters",
    address: "202 Maple Road, South Side, NY 10005",
    phoneNumber: "+1234567894",
    imageUrl: "https://example.com/amc.jpg",
    hasParking: true,
    hasFoodCourt: true,
  },
];

// Helper functions
const createFakePaymentMethod = (userId: string) => {
  const type = faker.helpers.arrayElement(Object.values(PaymentMethodType));

  return {
    user_id: userId,
    payment_method: type,
    card_last_four:
      type === PaymentMethodType.PAYPAL
        ? faker.finance.creditCardNumber("####")
        : undefined,
    payment_token: `tok_${faker.string.alphanumeric(10)}`,
    card_expiration_date:
      type === PaymentMethodType.PAYPAL
        ? `${faker.date.future().getMonth() + 1}/${faker.date
            .future()
            .getFullYear()
            .toString()
            .slice(-2)}`
        : undefined,
  };
};

const createFakeUser = () => {
  const gender = faker.helpers.arrayElement([
    Gender.MALE,
    Gender.FEMALE,
    Gender.OTHER,
  ]) as Gender;
  const genderParam =
    gender === Gender.OTHER
      ? undefined
      : (gender.toLowerCase() as "male" | "female");
  const firstName = faker.person.firstName(genderParam);
  const lastName = faker.person.lastName();

  return {
    email: faker.internet.email({ firstName, lastName }),
    username: faker.internet.username({ firstName, lastName }),
    password: faker.internet.password(),
    phoneNumber: faker.phone.number({ style: "national" }),
    dob: faker.date.birthdate(),
    gender,
    firstName,
    lastName,
    profileImageUrl: faker.image.avatar(),
    coverImageUrl: faker.image.url(),
    address: faker.location.streetAddress(),
  };
};

const createFakeReview = (userId: string, movieId: string) => {
  return {
    user_id: userId,
    movie_id: movieId,
    title: faker.lorem.sentence(5),
    content: faker.lorem.paragraphs(2),
    rating: parseFloat(
      faker.number.float({ min: 1, max: 5, fractionDigits: 1 }).toFixed(1)
    ),
    containsSpoilers: faker.datatype.boolean(),
  };
};

// Main seeding function
export const seedDatabase = async (
  dataSource: DataSource,
  userCount: number
) => {
  console.log("🌱 Starting database seeding process...");

  // Get all repositories
  const userRepository = dataSource.getRepository(User);
  const userStatusRepository = dataSource.getRepository(UserStatus);
  const settingRepository = dataSource.getRepository(Setting);
  const paymentMethodRepository = dataSource.getRepository(PaymentMethods);
  const genreRepository = dataSource.getRepository(Genre);
  const movieRepository = dataSource.getRepository(Movie);
  const cinemaRepository = dataSource.getRepository(Cinema);
  const theaterRepository = dataSource.getRepository(Theater);
  const seatRepository = dataSource.getRepository(Seat);
  const screeningRepository = dataSource.getRepository(Screening);
  const bookingRepository = dataSource.getRepository(Booking);
  const bookedSeatRepository = dataSource.getRepository(BookedSeat);
  const reviewRepository = dataSource.getRepository(Review);

  // Clear all data using raw queries to handle foreign key constraints
  console.log("🧹 Clearing existing data...");

  // Use a transaction for the delete operations
  await dataSource.transaction(async (manager) => {
    // Delete in proper order (child tables first)
    await manager.query('DELETE FROM "booked_seats"');
    await manager.query('DELETE FROM "bookings"');
    await manager.query('DELETE FROM "reviews"');
    await manager.query('DELETE FROM "screenings"');
    await manager.query('DELETE FROM "seats"');
    await manager.query('DELETE FROM "theaters"');
    await manager.query('DELETE FROM "cinemas"');

    // Handle many-to-many relationship for movies and genres
    await manager.query('DELETE FROM "movie_genres"');
    await manager.query('DELETE FROM "movies"');
    await manager.query('DELETE FROM "genres"');

    await manager.query('DELETE FROM "payment_methods"');
    await manager.query('DELETE FROM "settings"');
    await manager.query('DELETE FROM "user_status"');
    await manager.query('DELETE FROM "users"');
  });

  // 2. Seed users
  console.log(`Seeding ${userCount} users...`);
  const users: User[] = [];

  for (let i = 0; i < userCount; i++) {
    const userData = createFakeUser();

    // Create user
    const user = userRepository.create(userData);
    await userRepository.save(user);
    users.push(user);

    // Create user status
    const userStatus = userStatusRepository.create({
      user_id: user.id,
      isOnline: faker.datatype.boolean(),
      isSuspended: false,
      isDeleted: false,
    });
    await userStatusRepository.save(userStatus);

    // Add payment methods (1-3 per user)
    const paymentMethodsCount = faker.number.int({ min: 1, max: 3 });
    for (let j = 0; j < paymentMethodsCount; j++) {
      const paymentMethodData = createFakePaymentMethod(user.id);
      const paymentMethod = paymentMethodRepository.create(paymentMethodData);
      await paymentMethodRepository.save(paymentMethod);
    }

    // Add settings
    const settingsData = [
      {
        user_id: user.id,
        type: SettingType.NOTIFICATION,
        value: faker.datatype.boolean().toString(),
      },
      {
        user_id: user.id,
        type: SettingType.THEME,
        value: faker.helpers.arrayElement(["light", "dark"]),
      },
      {
        user_id: user.id,
        type: SettingType.LANGUAGE,
        value: faker.location.countryCode(),
      },
    ];

    for (const setting of settingsData) {
      const newSetting = settingRepository.create(setting);
      await settingRepository.save(newSetting);
    }
  }
  console.log(
    `✅ Created ${users.length} users with settings, statuses, and payment methods`
  );

  // 3. Seed genres
  console.log("🎭 Seeding movie genres...");
  const genres: Genre[] = [];

  for (const genreName of movieGenres) {
    const genre = genreRepository.create({ name: genreName });
    await genreRepository.save(genre);
    genres.push(genre);
  }
  console.log(`✅ Created ${genres.length} movie genres`);

  // 4. Seed movies with genres
  console.log("🎬 Seeding movies...");
  const movies: Movie[] = [];

  for (const movie of movieData) {
    const { genreNames, ...movieInfo } = movie;
    const movieEntity = movieRepository.create(movieInfo);

    // Add genres
    movieEntity.genres = [];
    for (const genreName of genreNames) {
      const genre = genres.find((g) => g.name === genreName);
      if (genre) {
        movieEntity.genres.push(genre);
      }
    }

    await movieRepository.save(movieEntity);
    movies.push(movieEntity);
  }
  console.log(`✅ Created ${movies.length} movies with genres`);

  // 5. Seed cinemas
  console.log("🏢 Seeding cinemas...");
  const cinemas: Cinema[] = [];

  for (const cinema of cinemaData) {
    const cinemaEntity = cinemaRepository.create(cinema);
    await cinemaRepository.save(cinemaEntity);
    cinemas.push(cinemaEntity);
  }
  console.log(`✅ Created ${cinemas.length} cinemas`);

  // 6. Seed theaters (2-4 per cinema)
  console.log("🎦 Seeding theaters...");
  const theaters: Theater[] = [];

  for (const cinema of cinemas) {
    const theaterCount = faker.number.int({ min: 2, max: 4 });

    for (let i = 1; i <= theaterCount; i++) {
      const theaterData = {
        name: `Theater ${i}`,
        totalSeats: faker.number.int({ min: 50, max: 200 }),
        has3D: faker.datatype.boolean(),
        hasIMAX: faker.datatype.boolean(),
        cinema_id: cinema.id,
      };

      const theater = theaterRepository.create(theaterData);
      await theaterRepository.save(theater);
      theaters.push(theater);
    }
  }
  console.log(`✅ Created ${theaters.length} theaters across all cinemas`);

  // 7. Seed seats for each theater
  console.log("💺 Seeding seats...");
  const seats: Seat[] = [];

  for (const theater of theaters) {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    const seatsPerRow = Math.floor(theater.totalSeats / rows.length);

    for (const row of rows) {
      for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
        // Determine seat type
        let seatType = "standard";
        if (row === "A" || row === "B") {
          seatType = "vip";
        } else if (seatNum === 1 || seatNum === seatsPerRow) {
          seatType = "accessible";
        }

        const seatData = {
          row: row,
          number: seatNum,
          type: seatType,
          theater_id: theater.id,
        };

        const seat = seatRepository.create(seatData);
        await seatRepository.save(seat);
        seats.push(seat);
      }
    }
  }
  console.log(`✅ Created ${seats.length} seats across all theaters`);

  // 8. Seed screenings (multiple per theater for different movies)
  console.log("🎞️ Seeding movie screenings...");
  const screenings: Screening[] = [];
  const formats = ["2D", "3D", "IMAX"];

  // Create screenings for the next 7 days
  for (let day = 0; day < 7; day++) {
    const screeningDate = new Date();
    screeningDate.setDate(screeningDate.getDate() + day);

    for (const theater of theaters) {
      // Each theater shows 3-4 movies per day
      const moviesPerDay = faker.number.int({ min: 3, max: 4 });
      const selectedMovies = faker.helpers.arrayElements(movies, moviesPerDay);

      for (let i = 0; i < selectedMovies.length; i++) {
        const movie = selectedMovies[i];

        // Create screening times throughout the day
        const startHour = 10 + i * 3; // Starting at 10 AM with 3 hours between screenings
        const screeningDateTime = new Date(screeningDate);
        screeningDateTime.setHours(startHour, 0, 0, 0);

        // Determine format based on theater capabilities
        let format = "2D";
        if (theater.has3D && faker.datatype.boolean()) {
          format = "3D";
        } else if (theater.hasIMAX && faker.datatype.boolean()) {
          format = "IMAX";
        }

        // Set price based on format
        let price = 12.99;
        if (format === "3D") price = 14.99;
        if (format === "IMAX") price = 16.99;

        const screeningData = {
          startTime: screeningDateTime,
          format: format,
          price: price,
          isAvailable: true,
          movie_id: movie.id,
          theater_id: theater.id,
        };

        const screening = screeningRepository.create(screeningData);
        await screeningRepository.save(screening);
        screenings.push(screening);
      }
    }
  }
  console.log(`✅ Created ${screenings.length} screenings`);

  // 9. Seed reviews
  console.log("✍️ Seeding movie reviews...");
  const reviews: Review[] = [];

  // Create ~3 reviews per movie
  for (const movie of movies) {
    const reviewCount = faker.number.int({ min: 2, max: 5 });
    const reviewers = faker.helpers.arrayElements(users, reviewCount);

    for (const user of reviewers) {
      const reviewData = createFakeReview(user.id, movie.id);
      const review = reviewRepository.create(reviewData);
      await reviewRepository.save(review);
      reviews.push(review);
    }
  }
  console.log(`✅ Created ${reviews.length} movie reviews`);

  // 10. Seed bookings and booked seats
  console.log("🎟️ Seeding bookings and booked seats...");
  const bookings: Booking[] = [];
  const bookedSeats: BookedSeat[] = [];

  // Create bookings for ~30% of screenings
  const bookingScreenings = faker.helpers.arrayElements(
    screenings,
    Math.floor(screenings.length * 0.3)
  );

  for (const screening of bookingScreenings) {
    // Get 1-3 random users to create bookings for this screening
    const bookingUsersCount = faker.number.int({ min: 1, max: 3 });
    const bookingUsers = faker.helpers.arrayElements(users, bookingUsersCount);

    for (const user of bookingUsers) {
      // Get a payment method for this user
      const paymentMethod = await paymentMethodRepository.findOne({
        where: { id: user.id },
      });

      if (!paymentMethod) continue;

      // Get available seats for this theater
      const availableSeats = await seatRepository.find({
        where: { theater_id: screening.theater_id },
      });

      // Book 1-4 seats
      const ticketCount = faker.number.int({ min: 1, max: 4 });
      const selectedSeats = faker.helpers.arrayElements(
        availableSeats,
        ticketCount
      );

      if (selectedSeats.length === 0) continue;

      // Create booking
      const totalAmount = parseFloat(
        (screening.price * selectedSeats.length).toFixed(2)
      );
      const bookingData = {
        referenceNumber: `INV-${faker.string.alphanumeric(8).toUpperCase()}`,
        ticketCount: selectedSeats.length,
        totalAmount: totalAmount,
        status: faker.helpers.arrayElement(Object.values(BookingStatus)),
        user_id: user.id,
        screening_id: screening.id,
        payment_method_id: paymentMethod.id,
      };

      const booking = bookingRepository.create(bookingData);
      await bookingRepository.save(booking);
      bookings.push(booking);

      // Create booked seats
      for (const seat of selectedSeats) {
        const bookedSeatData = {
          booking_id: booking.id,
          seat_id: seat.id,
          price: screening.price,
        };

        const bookedSeat = bookedSeatRepository.create(bookedSeatData);
        await bookedSeatRepository.save(bookedSeat);
        bookedSeats.push(bookedSeat);
      }
    }
  }

  console.log(
    `✅ Created ${bookings.length} bookings with ${bookedSeats.length} booked seats`
  );
  console.log("✅ Database seeding completed successfully!");
};
