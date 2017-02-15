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
      if (result.headers.link) res.set('link', result.headers.link);
      if (result.headers['x-wp-total']) res.set('x-wp-total', result.headers['x-wp-total']);
      if (result.headers['x-wp-totalpages'])
        res.set('x-wp-totalpages', result.headers['x-wp-totalpages']);
      if (isEmpty(result.body)) res.end(result.text);
      else res.json(result.body);
    } catch (error) {
      res.json({ error });
    }
  }),
);
