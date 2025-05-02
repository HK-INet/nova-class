const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () =>
  console.log('✅ MongoDB connected')
);
mongoose.connection.on('error', err =>
  console.error('❌ MongoDB connection error:', err)
);

module.exports = mongoose;
