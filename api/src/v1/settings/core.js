export default (req, res) => {
  const extensions = req.db.collection('extensions');
  extensions.find({
    service: req.params.service,
    core: true,
    type: { $in: ['extension', 'theme'] },
  }, {
    fields: {
      _id: 0,
      name: 1,
      type: 1,
      namespace: 1,
      'prod.main': 1,
      'prod.assets': 1,
    },
  }).toArray((error, docs) => {
    if (error) throw new Error('Error retrieving docs from extensions');
    res.json(docs);
  });
};
