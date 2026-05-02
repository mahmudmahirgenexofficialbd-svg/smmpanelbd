const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://mahmudmahirgenexofficialbd_db_user:XSP37pdMIWtTOAkl@cluster0.cxq8xnu.mongodb.net/smm-panel?retryWrites=true&w=majority&appName=Cluster0';

console.log('Connecting to MongoDB...');
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Connection failed:', err.message);
    process.exit(1);
  });
