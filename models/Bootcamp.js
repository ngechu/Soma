const mongoose = require('mongoose');

const BootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add  a name'],
    unique: true,
    trim: true,
    maxLength: [50, 'Name cannot exceed 50 characters'],
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please add  a description'],
    maxLength: [500, 'Name cannot exceed 500 characters'],
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL sith Http or Https',
    ],
  },
  phone: {
    type: String,
    maxLength: [20, 'Phone number cannot exceed 20 characters'],
  },
  email: {
    type: String,
  },
  address: {
    type: String,
    required: [true, 'Please add  an address'],
  },
  location: {
    //GEO JSON point

    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere',
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
  },
  careers: {
    //Array of strings
    type: [String],
    required: true,
    enum: [
      'Web Development',
      'Mobile Development',
      'UI/UX',
      'Data Science',
      'Business',
      'Other',
    ],
  },
});
