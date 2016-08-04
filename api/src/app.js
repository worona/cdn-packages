import express from 'express';
import mongodb from 'express-mongo-db';
import config from './config.json';
import settings from './v1/settings';

const app = express();

app.use(mongodb(config.mongoUrl));
app.use('/api/v1/settings', settings);

export default app;
