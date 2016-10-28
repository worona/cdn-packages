export default async (req, res) => {
  const packages = req.db.collection('packages');
  const service = req.params.service;
  const vendors = await packages.findOne(
    { name: `vendors-${service}-worona` }, { [`cdn.${service}.dev.main`]: 1 });
  const core = await packages.findOne(
    { name: `core-${service}-worona` }, { [`cdn.${service}.dev.main`]: 1 });
  res.json({
    vendors: `https://cdn.worona.io/packages/${vendors.cdn[service].dev.main.file}`,
    core: `https://cdn.worona.io/packages/${core.cdn[service].dev.main.file}`,
  });
};
