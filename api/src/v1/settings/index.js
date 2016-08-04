/* eslint-disable new-cap */
import express from 'express';
import dashboardCore from './dashboard-core';

export default express.Router()
  .get('/', (req, res) => res.send('Worona CDN working.'))
  .get('/dashboard-core', dashboardCore)
;

// .get('/dashboard-core'
// .get('/dashboard/:siteId/settings.json'
// .get('/app-pwa/:siteId/settings.json'
// .get('/app-pwa/:siteId/chcp.json'
// .get('/app-pwa/:siteId/chcp.manifest'
