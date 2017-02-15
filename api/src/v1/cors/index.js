/* eslint-disable new-cap */
import express from 'express';
import request from 'superagent';
import { isEmpty } from 'lodash';

const async = fn => (...args) => fn(...args).catch(args[2]);

export default express.Router().get(
  /\/(.+)/,
  async(async (req, res) => {
    try {
      const result = await request(req.url.replace(/^(\/)/, ''));
      if (isEmpty(result.body))
        res.end(result.text);
      else
        res.json(result.body);
    } catch (error) {
      res.json({ error });
    }
  }),
);
