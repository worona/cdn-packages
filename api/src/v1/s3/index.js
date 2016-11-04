/* eslint-disable new-cap */
import express from 'express';
import sign from './sign';

export default express.Router()
  .get('/', (req, res) => res.send('Worona CDN working.'))
  .get('/sign', sign)
;
