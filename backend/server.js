import express, { json } from 'express';
import cors from 'cors';
import Mongoose from 'mongoose';
import routes from './routes/index.js';

const port = 3000;

main().catch((err) => console.log(err));

async function main() {
  await Mongoose.connect('mongodb://mongo:27017/faves', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  const app = express();
  app.use(cors());
  app.use(json());
  app.use('/api', routes);

  app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
  });
}
