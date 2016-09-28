export default (req, res) => {
  const packages = req.db.collection('packages');
  const service = req.params.service;
  packages.findOne({ name: `core-${service}-worona` }, { 'dev.files': 1 },
    (error, docs) => {
      if (error) throw new Error(`Error retrieving core and vendors of ${service}`);
      const vendors = `https://cdn.worona.io/packages/${docs.dev.files[0].file}`;
      const core = `https://cdn.worona.io/packages/${docs.dev.files[1].file}`;
      res.json({ vendors, core });
    }
  );
};
