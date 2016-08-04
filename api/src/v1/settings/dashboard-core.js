export default (req, res) => {
  const extensions = req.db.collection('extensions');
  extensions.find({
    service: 'dashboard',
    core: true,
    type: { $in: ['extension', 'theme'] },
  }, {
    fields: {
      name: 1,
      type: 1,
    },
  }).toArray((error, docs) => {
    if (error) throw new Error('Error retrieving docs from extensions');
    res.json(docs);
  });
};
