import 'babel-polyfill';
import express from 'express';
import mongodb from 'express-mongo-db';
import expressCors from 'cors';
import { urlencoded } from 'body-parser';
import config from '../config.json';
import settings from './v1/settings';
import s3 from './v1/s3';
import chcp from './v1/chcp';
import subscriptions from './v1/subscriptions';
import cors from './v1/cors';
import manifest from './v1/manifest';

const app = express();

app.use(expressCors());
app.use(urlencoded({ extended: true }));
app.use(mongodb(config.mongoUrl));
app.use('/api/v1/settings', settings);
app.use('/api/v1/s3', s3);
app.use('/api/v1/chcp', chcp);
app.use('/api/v1/subscriptions', subscriptions);
app.use('/api/v1/cors', cors);
app.use('/api/v1/manifest', manifest);

export default app;
