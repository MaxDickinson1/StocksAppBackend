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
      type: {
        type: String,
        enum: ['stock', 'crypto'],
        required: true,
      },
      symbol: {
        type: String,
        required: true,
      },
      name: String,
    },
  ],
  
  
});

module.exports = mongoose.model('User', UserSchema);
