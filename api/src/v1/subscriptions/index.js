/* eslint-disable new-cap */
import express from 'express';
import subscribe from './mixpanel/subscribe';
import unsubscribe from './mixpanel/unsubscribe';

const async = fn => (...args) => fn(...args).catch(args[2]);

export default express
  .Router()
  .get('/', (req, res) => res.send('Worona CDN working.'))
  .post('/mixpanel/:env/subscribe', async(subscribe))
  .post('/mixpanel/:env/unsubscribe', async(unsubscribe))
;
