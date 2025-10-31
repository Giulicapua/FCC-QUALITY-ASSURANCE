const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Biblioteca Personal - MongoDB Conectado');
  } catch (error) {
    console.error('Error de conexión:', error);
    process.exit(1);
  }
};

module.exports = connectDB;