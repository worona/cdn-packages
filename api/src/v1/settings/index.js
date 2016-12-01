/* eslint-disable new-cap */
import express from 'express';
import core from './core';
import site from './site';
import development from './development';

const async = fn => (...args) => fn(...args).catch(args[2]);

export default express.Router()
  .get('/', (req, res) => res.send('Worona CDN working.'))
  .get('/core/:service/:env', async(core))
  .get('/site/:siteId/:service/:env/:type', async(site))
  .get('/package-development/:service/:env', async(development))
;
