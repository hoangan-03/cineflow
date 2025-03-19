import { AppDataSource } from '@/datasource/data-source';
import { seedDatabase } from '@/seeder/database.seed';

const runSeed = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Connected to database');

    await seedDatabase(AppDataSource);
    console.log('Seeds planted successfully');

    await AppDataSource.destroy();
    console.log('Connection closed');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

runSeed();