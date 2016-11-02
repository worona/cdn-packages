/* eslint-disable no-unused-vars */
export default async (req, res) => {
  const service = req.params.service;
  const env = req.params.env;
  const packages = req.db.collection('packages');
  const docs = await packages.find(
    { service, core: true, type: { $in: ['extension', 'theme'] } },
    { fields: {
      _id: 0,
      name: 1,
      namespace: 1,
      [`cdn.${service}.${env}.main`]: 1,
      [`cdn.${service}.${env}.assets`]: 1,
    },
  }).toArray();

  res.json(docs.map((doc) => {
    const { cdn, ...rest } = doc;
    return {
      ...rest,
      main: doc.cdn[service][env].main.file,
      assets: doc.cdn[service][env].assets,
    };
  }));
};
