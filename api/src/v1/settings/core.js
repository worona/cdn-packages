import { unique } from 'shorthash';

/* eslint-disable no-unused-vars */
export default async (req, res) => {
  const service = req.params.service;
  const env = req.params.env;
  const packages = req.db.collection('packages');
  const docs = await packages
    .find({ [`${service}.core`]: true, [`${service}.type`]: { $in: [ 'extension', 'theme' ] } }, {
      fields: {
        _id: 0,
        name: 1,
        [`${service}.namespace`]: 1,
        [`${service}.${env}.main`]: 1,
        [`${service}.${env}.assets`]: 1,
      },
    })
    .toArray();

  const cacheTags = docs.map(doc => doc.name).map(tag => unique(tag).substring(0, 3)).join(' ');
  if (cacheTags.length > 128) throw new Error('Cache-Tag is bigger than 128 characters.');

  res.setHeader('Cache-Tag', cacheTags);
  res.json(
    docs.map(doc => {
      const { dashboard, ...rest } = doc;
      return {
        ...rest,
        namespace: doc[service].namespace,
        main: doc[service][env].main.file,
        assets: doc[service][env].assets,
      };
    }),
  );
}
