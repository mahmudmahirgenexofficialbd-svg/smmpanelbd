require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./models/Service');

const services = [
  {
    name: 'Instagram Followers [Real & Fast]',
    platform: 'instagram',
    category: 'Followers',
    pricePer1k: 15.50,
    minQuantity: 100,
    maxQuantity: 50000,
    description: 'Real looking followers. High quality and fast delivery.'
  },
  {
    name: 'Instagram Likes [Instant]',
    platform: 'instagram',
    category: 'Likes',
    pricePer1k: 5.20,
    minQuantity: 50,
    maxQuantity: 20000,
    description: 'Instant start. Works on all posts.'
  },
  {
    name: 'Facebook Page Likes [Non-Drop]',
    platform: 'facebook',
    category: 'Page Likes',
    pricePer1k: 25.00,
    minQuantity: 100,
    maxQuantity: 10000,
    description: 'Lifetime guarantee. High quality profiles.'
  },
  {
    name: 'YouTube Views [Organic]',
    platform: 'youtube',
    category: 'Views',
    pricePer1k: 45.00,
    minQuantity: 1000,
    maxQuantity: 100000,
    description: 'Safe organic views. Helps in ranking.'
  },
  {
    name: 'TikTok Followers [Global]',
    platform: 'tiktok',
    category: 'Followers',
    pricePer1k: 12.00,
    minQuantity: 100,
    maxQuantity: 30000,
    description: 'Global followers for TikTok growth.'
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');
    
    await Service.deleteMany({});
    console.log('Cleared existing services.');
    
    await Service.insertMany(services);
    console.log('Added initial services.');
    
    mongoose.connection.close();
    console.log('Seeding complete.');
  } catch (err) {
    console.error('Seeding error:', err);
  }
}

seed();
