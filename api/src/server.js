import express from 'express';
import config from '../config.json';

function getApp() {
  return require('./app').default;
}

export default express()
  .use((req, res) => getApp().handle(req, res))
  .listen(config.port, (error) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log(`Listening at http://localhost:${config.port}`);
  })
;
