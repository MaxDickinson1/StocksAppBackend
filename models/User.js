const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  favorites: [
    {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      symbol: String,
      image: String,
      current_price: Number,
      description: {
        en: String,
      },
    },
  ],
  
  
  
});

module.exports = mongoose.model('User', UserSchema);
