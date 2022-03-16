import mysql from 'mysql2';
import { config } from './config';
import { logger } from './logger';

export const pool = mysql.createPool({
  host: config.DB.host,
  user: config.DB.user,
  password: config.DB.password,
  database: config.DB.name,
  connectionLimit: 10,
});

export const promisePool = pool.promise();

export const connectDB = () => {
  pool.getConnection((error, connection) => {
    if (error) {
      throw error;
    }

    promisePool.getConnection();

    logger.info('Database connection established');
    return;
  });
};
