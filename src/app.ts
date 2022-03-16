import { config } from './config/config';
import { logger } from './config/logger';
import { connectDB } from './config/mysql';
import { app } from './server';

connectDB();

const server = app
  .listen(config.port, () => {
    logger.info(`Server running on port ${config.port}`);
  })
  .on('error', (error) => {
    logger.error(error);
    process.exit(1);
  });

const exitHandler = () => {
  !server && process.exit(1);

  server.close(() => {
    logger.info('Server closed');
    process.exit(1);
  });
};

const unexpectedErrorHandler = (error: any) => {
  logger.error(error);
  exitHandler();
};

if (config.nodeEnv === 'production') {
  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    server?.close();
  });
}
