/* eslint-disable new-cap */
import express from 'express';
import subscription from './subscription';
import issubscribed from './is-unsubscribed';

const async = fn => (...args) => fn(...args).catch(args[2]);

export default express
  .Router()
  .get('/', (req, res) => res.send('Worona CDN working.'))
  .post('/is-unsubscribed', async(issubscribed))
  .post('/:status', async(subscription)) // Status can be 'subscribe' or 'unsubscribe'.
;
