import { DataSource } from "typeorm";
import { faker } from "@faker-js/faker";
import { User } from "@/entities/user.entity";
import { Gender } from "@/modules/user/enums/gender.enum";
import { Movie } from "@/entities/movie.entity";
import { Cinema } from "@/entities/cinema.entity";
import { Room } from "@/entities/room.entity";
import { Seat } from "@/entities/seat.entity";
import { Screening } from "@/entities/screening.entity";
import { Booking } from "@/entities/booking.entity";
import { BookedSeat } from "@/entities/booked-seat.entity";
import { Review } from "@/entities/review.entity";
import { Genre } from "@/entities/genre.entity";
import { BookingStatus } from "@/modules/booking/enums/booking-status.enum";
import { Role } from "@/modules/auth/enums/role.enum";
import { cinemaData, movieData, movieGenres } from "./sample-data";
import { hashPassword } from "@/utils/hash-password";
import { SeatType } from "@/modules/seat/enums/seat-type.enum";
import { Voucher } from "@/entities/voucher.entity";

const createFakeUser = async (isTestUser = false) => {
  const gender = faker.helpers.arrayElement([
    Gender.MALE,
    Gender.FEMALE,
    Gender.OTHER,
  ]) as Gender;

  // Use fixed values for test user, random values for others
  const email = isTestUser
    ? "testuseremail@gmail.com"
    : faker.internet.email().toLowerCase();
  const username = isTestUser
    ? "testuser123"
    : faker.internet.username().toLowerCase();
  const password = "Password123@";
  const hashedPassword = await hashPassword(password);

  return {
    email: email,
    username: username,
    password: hashedPassword,
    phoneNumber: faker.phone.number({ style: "national" }),
    dob: faker.date.birthdate(),
    gender,
    profileImageUrl: faker.image.avatar(),
    address: faker.location.streetAddress(),
    role: Role.MOVIEGOER,
  };
};

const createFakeStaff = async (isTestStaff = false) => {
  const gender = faker.helpers.arrayElement([
    Gender.MALE,
    Gender.FEMALE,
    Gender.OTHER,
  ]) as Gender;

  // Use fixed values for test staff, random values for others
  const email = isTestStaff
    ? "teststaffemail@gmail.com"
    : `staff.${faker.internet.email()}`.toLowerCase();
  const username = isTestStaff
    ? "teststaff123"
    : `staff_${faker.internet.username()}`.toLowerCase().substring(0, 20);
  const password = "Password123@";
  const hashedPassword = await hashPassword(password);

  return {
    email: email,
    username: username,
    password: hashedPassword,
    phoneNumber: faker.phone.number({ style: "national" }),
    dob: faker.date.birthdate(),
    gender,
    profileImageUrl: faker.image.avatar(),
    address: faker.location.streetAddress(),
    role: Role.STAFF,
  };
};
const createFakeReview = (userId: number, movieId: number) => {
  return {
    user_id: userId,
    movie_id: movieId,
    content: faker.lorem.paragraphs(2),
    rating: parseFloat(
      faker.number.float({ min: 1, max: 5, fractionDigits: 1 }).toFixed(1)
    ),
    timeStamp: faker.date.recent(),
    isEdited: faker.datatype.boolean(),
  };
};

const usedDiscounts = new Set<string>();
const createFakeVoucher = () => {
  let discountAmount: string;
  do {
    discountAmount = faker.number.int({ min: 5, max: 50 }) + "%";
  } while (usedDiscounts.has(discountAmount));
  usedDiscounts.add(discountAmount);

  // Expiry date between 1 month and 18 months from now
  const expDate = faker.date.future({ years: 1.5 });

  return {
    discount: discountAmount,
    exp_date: expDate,
  };
};

// Seeding function
export const seedDatabase = async (dataSource: DataSource) => {
  console.log("🌱 Starting database seeding process...");

  // Get all repositories
  const userRepository = dataSource.getRepository(User);
  const genreRepository = dataSource.getRepository(Genre);
  const movieRepository = dataSource.getRepository(Movie);
  const cinemaRepository = dataSource.getRepository(Cinema);
  const roomRepository = dataSource.getRepository(Room);
  const seatRepository = dataSource.getRepository(Seat);
  const screeningRepository = dataSource.getRepository(Screening);
  const bookingRepository = dataSource.getRepository(Booking);
  const bookedSeatRepository = dataSource.getRepository(BookedSeat);
  const reviewRepository = dataSource.getRepository(Review);
  const voucherRepository = dataSource.getRepository(Voucher);

  // Clear all data using raw queries to handle foreign key constraints
  console.log("🧹 Clearing existing data...");

  // Use a transaction for the delete operations
  await dataSource.transaction(async (manager) => {
    await manager.query('DELETE FROM "booked_seats"');
    await manager.query('DELETE FROM "bookings"');
    await manager.query('DELETE FROM "reviews"');
    await manager.query('DELETE FROM "screenings"');
    await manager.query('DELETE FROM "seats"');
    await manager.query('DELETE FROM "rooms"');
    await manager.query('DELETE FROM "cinemas"');
    await manager.query('DELETE FROM "movie_genres"');
    await manager.query('DELETE FROM "movies"');
    await manager.query('DELETE FROM "genres"');
    await manager.query('DELETE FROM "user_vouchers"');
    await manager.query('DELETE FROM "vouchers"');
    await manager.query('DELETE FROM "users"');
  });

  const regularUserCount = 100;
  const regularStaffCount = 10;

  const testUserData = await createFakeUser(true);
  const testUser = userRepository.create(testUserData);
  await userRepository.save(testUser);
  const users: User[] = [testUser];

  for (let i = 0; i < regularUserCount; i++) {
    const userData = await createFakeUser(false);
    const user = userRepository.create(userData);
    await userRepository.save(user);
    users.push(user);
  }
  console.log(
    `✅ Created ${users.length} users (1 test user + ${regularUserCount} regular users)`
  );

  const testStaffData = await createFakeStaff(true);
  const testStaff = userRepository.create(testStaffData);
  await userRepository.save(testStaff);

  const staffs: User[] = [testStaff];

  for (let i = 0; i < regularStaffCount; i++) {
    const staffData = await createFakeStaff(false);
    const staff = userRepository.create(staffData);
    await userRepository.save(staff);
    staffs.push(staff);
  }
  console.log(
    `✅ Created ${staffs.length} staff (1 test staff + ${regularStaffCount} regular staff)`
  );

  // Seed vouchers
  console.log("🎫 Seeding vouchers...");
  const vouchers: Voucher[] = [];

  const voucherCount = 20;
  const generatedCodes = new Set<string>();
  const generateRandomCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const codeLength = 3;

    let result = "";
    do {
      result = "";
      for (let i = 0; i < codeLength; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
    } while (generatedCodes.has(result));

    generatedCodes.add(result);
    return result;
  };

  for (let i = 0; i < voucherCount; i++) {
    const voucherData = createFakeVoucher();
    const voucherEntity = voucherRepository.create({
      ...voucherData,
      code: generateRandomCode(),
    });

    // Assign voucher to random users (30% chance)
    if (faker.datatype.boolean(0.3)) {
      const userCount = faker.number.int({ min: 1, max: 5 });
      const selectedUsers = faker.helpers.arrayElements(users, userCount);
      voucherEntity.users = selectedUsers;
    }

    await voucherRepository.save(voucherEntity);
    vouchers.push(voucherEntity);
  }
  console.log(`✅ Created ${vouchers.length} vouchers`);

  // Seed genres
  console.log("🎭 Seeding movie genres...");
  const genres: Genre[] = [];

  for (const genreName of movieGenres) {
    const genre = genreRepository.create({ name: genreName });
    await genreRepository.save(genre);
    genres.push(genre);
  }
  console.log(`✅ Created ${genres.length} movie genres`);

  // Seed movies with genres
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

  // Seed cinemas
  console.log("🏢 Seeding cinemas...");
  const cinemas: Cinema[] = [];

  for (const cinema of cinemaData) {
    const cinemaEntity = cinemaRepository.create(cinema);
    await cinemaRepository.save(cinemaEntity);
    cinemas.push(cinemaEntity);
  }
  console.log(`✅ Created ${cinemas.length} cinemas`);

  // Seed rooms (2-4 per cinema)
  console.log("🎦 Seeding rooms...");
  const rooms: Room[] = [];

  for (const cinema of cinemas) {
    const roomCount = faker.number.int({ min: 2, max: 4 });

    for (let i = 1; i <= roomCount; i++) {
      const roomData = {
        name: `Room ${i}`,
        totalSeats: faker.number.int({ min: 50, max: 200 }),
        cinema_id: cinema.id,
      };

      const room = roomRepository.create(roomData);
      await roomRepository.save(room);
      rooms.push(room);
    }
  }
  console.log(`✅ Created ${rooms.length} rooms across all cinemas`);

  // Seed seats for each room
  console.log("💺 Seeding seats...");
  const seats: Seat[] = [];

  for (const room of rooms) {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    const seatsPerRow = Math.floor(room.totalSeats / rows.length);

    for (const row of rows) {
      for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
        // Determine seat type
        let seatType = SeatType.STANDARD;
        if (row === "A" || row === "B") {
          seatType = SeatType.VIP;
        } else if (seatNum === 1 || seatNum === seatsPerRow) {
          seatType = SeatType.ACCESSIBLE;
        }

        const seatData = {
          row: row,
          number: seatNum,
          type: seatType,
          room_id: room.id,
        };

        const seat = seatRepository.create(seatData);
        await seatRepository.save(seat);
        seats.push(seat);
      }
    }
  }
  console.log(`✅ Created ${seats.length} seats across all rooms`);

  // Seed screenings (multiple per room for different movies)
  console.log("🎞️ Seeding movie screenings...");
  const screenings: Screening[] = [];

  // Create screenings for the next 7 days
  for (let day = 0; day < 7; day++) {
    const screeningDate = new Date();
    screeningDate.setDate(screeningDate.getDate() + day);

    for (const room of rooms) {
      // Each room shows 3-4 movies per day
      const moviesPerDay = faker.number.int({ min: 3, max: 4 });
      const selectedMovies = faker.helpers.arrayElements(movies, moviesPerDay);

      for (let i = 0; i < selectedMovies.length; i++) {
        const movie = selectedMovies[i];

        // Create screening times throughout the day
        const startHour = 10 + i * 3; // Starting at 10 AM with 3 hours between screenings
        const screeningDateTime = new Date(screeningDate);
        screeningDateTime.setHours(startHour, 0, 0, 0);
        const formats = ["2D", "3D", "IMAX"];
        const format = faker.helpers.arrayElement(formats);
        let price = 12.99;
        if (format === "3D") price = 14.99;
        if (format === "IMAX") price = 16.99;

        const screeningData = {
          startTime: screeningDateTime,
          format: format,
          price: price,
          isAvailable: true,
          movie_id: movie.id,
          room_id: room.id,
        };

        const screening = screeningRepository.create(screeningData);
        await screeningRepository.save(screening);
        screenings.push(screening);
      }
    }
  }
  console.log(`✅ Created ${screenings.length} screenings`);

  // Seed reviews
  console.log("✍️ Seeding movie reviews...");
  const reviews: Review[] = [];

  for (const movie of movies) {
    const reviewCount = faker.number.int({ min: 4, max: 20 });
    const reviewers = faker.helpers.arrayElements(users, reviewCount);

    for (const user of reviewers) {
      const reviewData = createFakeReview(user.id, movie.id);
      const review = reviewRepository.create(reviewData);
      await reviewRepository.save(review);
      reviews.push(review);
    }
  }
  console.log(`✅ Created ${reviews.length} movie reviews`);

  // Seed bookings and booked seats
  console.log("🎟️ Seeding bookings and booked seats...");
  const bookings: Booking[] = [];
  const bookedSeats: BookedSeat[] = [];

  // Create bookings for ~60% of screenings
  const bookingScreenings = faker.helpers.arrayElements(
    screenings,
    Math.floor(screenings.length * 0.6)
  );

  for (const screening of bookingScreenings) {
    // Get 1-3 random users to create bookings for this screening
    const bookingUsersCount = faker.number.int({ min: 1, max: 3 });
    const bookingUsers = faker.helpers.arrayElements(users, bookingUsersCount);

    for (const user of bookingUsers) {
      // Get available seats for this room
      const availableSeats = await seatRepository.find({
        where: { room_id: screening.room_id },
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
      };

      const booking = bookingRepository.create(bookingData);
      await bookingRepository.save(booking);
      bookings.push(booking);

      // Create booked seats
      for (const seat of selectedSeats) {
        const bookedSeatData = {
          booking_id: booking.id,
          seat_id: seat.id,
          screening_id: screening.id,
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
