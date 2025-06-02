import initApp from '@/app';
import config from '@/config';
import 'dotenv/config';
import redisClient from './redis';

async function server() {
  const app = await initApp();

  // Add here async initializations
  await redisClient.connect();

  app.listen(config.PORT);
}

server();
