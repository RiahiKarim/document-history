import dotenv from 'dotenv';
import fs from 'fs';

if (fs.existsSync('.env')) {
  console.log('Using .env file to supply config environment variables');
  dotenv.config({ path: '.env' });
} else {
  console.log('Using .env.template file to supply config environment variables');
  dotenv.config({ path: '.env.template' });
}

export const MONGODB_URI = process.env['MONGODB_URI'] || '';

if (!MONGODB_URI) {
  throw new Error('No mongo connection string. Set MONGODB_URI environment variable.');
}
