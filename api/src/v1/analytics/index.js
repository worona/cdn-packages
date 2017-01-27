/* eslint-disable new-cap */
import express from 'express';
import mixpanelSiteIdToEmail from './mixpanel/siteid-to-email';

const async = fn => (...args) => fn(...args).catch(args[2]);

export default express
  .Router()
  .get('/', (req, res) => res.send('Worona CDN working.'))
  .get('/mixpanel/:env/siteid-to-email', async(mixpanelSiteIdToEmail));
