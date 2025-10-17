import Mongoose from 'mongoose';

const Fave = new Mongoose.Schema({
  user: {
    type: Number,
  },
  key: {
    type: String,
  },
  value: {
    type: String,
  },
});

const db = Mongoose.model('Fave', Fave);

db.collection.createIndex({ user: 1, key: 1, value: 1 }, { unique: true });

export default db;
