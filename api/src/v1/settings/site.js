/* eslint-disable no-unused-vars */
export default async (req, res) => {
  const siteId = req.params.siteId;
  const service = req.params.service;
  const env = req.params.env;
  const type = req.params.type;
  const settings = req.db.collection('settings-live');
  const packages = req.db.collection('packages');
  const sites = req.db.collection('sites');
  const site = await sites.findOne({ _id: siteId }, { fields: {
    userIds: 0, createdAt: 0, modifiedAt: 0, status: 0 } });
  if (!site) { res.status(404).json({ error: 'no site found' }); return; }
  const docs = await settings.find(
    { 'woronaInfo.siteId': siteId, 'woronaInfo.active': true },
    { fields: {
      'woronaInfo.active': 0,
      'woronaInfo.siteId': 0,
      'woronaInfo.init': 0,
      'woronaInfo.namespace': 0,
    } },
  ).toArray();
  if (type === 'preview') {
    docs.push({ woronaInfo: { name: 'preview-settings-app-extension-worona' } });
  }
  const response = [];
  const fields = {
    _id: 0,
    [`${service}.${env}.main.file`]: 1,
    [`${service}.namespace`]: 1,
    ...{
      dashboard: { [`${service}.menu`]: 1 },
      app: {},
    }[service],
  };
  for (let i = 0; i < docs.length; i += 1) {
    const doc = docs[i];
    const pkg = await packages.findOne(
      { name: doc.woronaInfo.name, [service]: { $exists: true } },
      { fields }
    );
    if (pkg) {
      const { app, dashboard, ...rest } = pkg;
      const woronaInfo = {
        ...rest,
        ...doc.woronaInfo,
        main: pkg[service][env].main.file,
        namespace: pkg[service].namespace,
      };
      response.push({ ...doc, woronaInfo });
    }
  }
  response.push({ ...site, woronaInfo: { name: 'site-general-settings', namespace: 'generalSite' } });
  res.json(response);
};
