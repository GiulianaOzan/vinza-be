import initApp from '@/app';
import config from '@/config';
import 'dotenv/config';

function server() {
  const app = initApp();
  app.listen(config.PORT);
}

server();
