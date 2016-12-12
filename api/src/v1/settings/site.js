/* eslint-disable no-unused-vars */
export default async (req, res) => {
  const siteId = req.params.siteId;
  const service = req.params.service;
  const env = req.params.env;
  const type = req.params.type;
  const settings = req.db.collection(`settings-${type}`);
  const packages = req.db.collection('packages');
  const sites = req.db.collection('sites');
  const site = await sites.findOne({ _id: siteId }, { fields: {
    _id: 0, userIds: 0, createdAt: 0, modifiedAt: 0, status: 0 } });
  const docs = await settings.find(
    { 'woronaInfo.siteId': siteId, 'woronaInfo.active': true },
    { fields: { _id: 0, 'woronaInfo.active': 0, 'woronaInfo.siteId': 0, 'woronaInfo.init': 0 } }
  ).toArray();
  const response = [];
  const fields = {
    _id: 0,
    [`cdn.${service}.${env}.main.file`]: 1,
    namespace: 1,
    ...{
      dashboard: { menu: 1, niceName: 1, type: 1 },
      app: {},
    }[service],
  };
  for (let i = 0; i < docs.length; i += 1) {
    const doc = docs[i];
    const pkg = await packages.findOne(
      { name: doc.woronaInfo.name, services: { $in: [service] } },
      { fields }
    );
    if (pkg) {
      const { cdn, ...rest } = pkg;
      const woronaInfo = { ...doc.woronaInfo, ...rest, main: pkg.cdn[service][env].main.file };
      response.push({ ...doc, woronaInfo });
    }
  }
  response.push({ ...site, woronaInfo: { name: 'site-general-settings', namespace: 'generalSite' } });
  res.json(response);
};
