import { UserService } from '../src/lib/database';
import path from 'path';
import fs from 'fs';

async function seedDatabase() {
  try {
    console.log('Seeding database...');

    await UserService.seedDatabase();

    console.log('Database seeded successfully!');
    console.log('Test users created:');
    console.log('- admin@example.com / admin123');
    console.log('- user@example.com / user123');
    console.log('- test@example.com / test123');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
