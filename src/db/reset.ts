import { sequelize } from '.';

async function reset() {
  await sequelize.truncate();
  await sequelize.sync({ force: true, logging: false });
}

reset().then(() => {
  // eslint-disable-next-line no-console
  console.log('Database reset successfully');
  process.exit(0);
});
