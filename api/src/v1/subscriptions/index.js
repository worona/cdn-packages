/* eslint-disable new-cap */
import express from 'express';
import subscription from './mixpanel/subscription';
import issubscribed from './mixpanel/issubscribed';

const async = fn => (...args) => fn(...args).catch(args[2]);

export default express
  .Router()
  .get('/', (req, res) => res.send('Worona CDN working.'))
  .post('/mixpanel/:env/issubscribed', async(issubscribed))
  .post('/mixpanel/:env/:status', async(subscription)) // Status can be 'subscribe' or 'unsubscribe'.
;
