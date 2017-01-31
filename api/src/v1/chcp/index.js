/* eslint-disable new-cap */
import express from 'express';
import chcpJson from './chcp-json';
import chcpManifest from './chcp-manifest';

const async = fn => (...args) => fn(...args).catch(args[2]);

export default express.Router()
  .get('/', (req, res) => res.send('Worona CDN working.'))
  .get('/site/:siteId/chcp.json', async(chcpJson))
  .get('/site/:siteId/chcp.manifest', async(chcpManifest))
;
