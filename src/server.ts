import initApp from '@/app';
import 'dotenv/config';

function server() {
  const app = initApp();
  app.listen(process.env.PORT || 5000);
}

server();
