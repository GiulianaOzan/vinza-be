import initApp from '@/app';
import config from '@/config';
import 'dotenv/config';

async function server() {
  const app = await initApp();
  app.listen(config.PORT);
}

server();
