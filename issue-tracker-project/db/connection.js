const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB conectado exitosamente'))
.catch(err => console.log('Error de conexion a MongoDB:', err));

module.exports = mongoose;