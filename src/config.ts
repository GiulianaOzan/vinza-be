export default {
  PORT: process.env.PORT || 5000,
  API_VERSION: process.env.API_VERSION || 'v1',
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  IS_TRACING_ENABLED: process.env.IS_TRACING_ENABLED === 'true' || false,
};
