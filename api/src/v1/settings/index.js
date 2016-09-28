/* eslint-disable new-cap */
import express from 'express';
import core from './core';
import development from './development';

export default express.Router()
  .get('/', (req, res) => res.send('Worona CDN working.'))
  .get('/core/:service', core)
  .get('/package-development/:service', development)
;
