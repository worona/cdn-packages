/* eslint-disable new-cap */
import express from 'express';
import sign from './sign';

const async = fn => (...args) => fn(...args).catch(args[2]);

export default express.Router()
  .get('/', (req, res) => res.send('Worona CDN working.'))
  .get('/sign', async(sign))
;
