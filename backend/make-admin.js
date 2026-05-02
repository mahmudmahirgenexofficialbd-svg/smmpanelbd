require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const username = process.argv[2];

if (!username) {
  console.log('Usage: node make-admin.js <username>');
  process.exit(1);
}

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOneAndUpdate({ username }, { role: 'admin' }, { new: true });
    
    if (user) {
      console.log(`✅ Success: ${username} is now an admin.`);
    } else {
      console.log(`❌ Error: User "${username}" not found.`);
    }
  } catch (err) {
    console.error('Connection error:', err);
  } finally {
    mongoose.connection.close();
  }
}

run();
