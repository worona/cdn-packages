import config from '../../../config.json';

const cdn = config.isPre ? 'precdn' : 'cdn';

export default async (req, res) => {
  const packages = req.db.collection('packages');
  const service = req.params.service;
  const env = req.params.env;
  const vendors = await packages.findOne(
    { name: `vendors-${service}-worona` }, { [`${service}.${env}.main`]: 1 });
  const core = await packages.findOne(
    { name: `core-${service}-worona` }, { [`${service}.${env}.main`]: 1 });
  res.json({
    vendors: `https://${cdn}.worona.io/packages/${vendors[service][env].main.file}`,
    core: `https://${cdn}.worona.io/packages/${core[service][env].main.file}`,
  });
};
