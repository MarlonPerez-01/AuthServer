import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';

import { config } from './config/config';
import { errorConverter, errorHandler, notFoundHandler } from './middlewares/error';
import { router } from './routes/index.routes';

export const app = express();

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(compression());

app.use(cors({ origin: config.clientURL }));

if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

app.use('/uploads', express.static('public/uploads'));

app.use('/', router);

app.use(notFoundHandler);
app.use(errorConverter);
app.use(errorHandler);
