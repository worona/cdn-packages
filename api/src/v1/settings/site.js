/* eslint-disable no-unused-vars */
export default async (req, res) => {
  const siteId = req.params.siteId;
  const settings = req.db.collection('settings');
  const packages = req.db.collection('packages');
  const docs = await settings.find({ siteId }, { fields: { _id: 0, siteId: 0 } }).toArray();
  const response = [];
  for (let i = 0; i < docs.length; i += 1) {
    const doc = docs[i];
    const pkg = await packages.findOne({ name: doc.package.name });
    response.push({ ...doc, package: { ...pkg } });
  }
  res.json(response);
};
