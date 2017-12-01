import mongoose from 'mongoose';

export default function connect() {
  mongoose.connect('mongodb://localhost/test', { useMongoClient: true });
  mongoose.Promise = global.Promise;

  const db = mongoose.connection;
  db.on('error', () => {
    console.log('---FAILED to connect to mongoose');
  });
  db.once('open', () => {
    console.log('+++Connected to mongoose');
  });
}
