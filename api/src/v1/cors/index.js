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
      res.header('status', 200);
      if (isEmpty(result.body)) {
        res.end(result.text);
      } else {
        res.header('x-wp-total', result.headers['x-wp-total']);
        res.header('x-wp-totalpages', result.headers['x-wp-totalpages']);
        res.header('link', result.headers.link);
        res.header('access-control-expose-headers', 'x-wp-total, x-wp-totalpages');
        res.json(result.body);
      }
    } catch (error) {
      res.json({ error });
    }
  }),
);
