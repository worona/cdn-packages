import 'babel-polyfill';
import express from 'express';
import mongodb from 'express-mongo-db';
import cors from 'cors';
import config from '../config.json';
import settings from './v1/settings';
import s3 from './v1/s3';
import analytics from './v1/analytics';

const app = express();

app.use(cors());
app.use(mongodb(config.mongoUrl));
app.use('/api/v1/settings', settings);
app.use('/api/v1/s3', s3);
app.use('/api/v1/analytics', analytics);

export default app;
