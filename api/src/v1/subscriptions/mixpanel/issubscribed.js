export default async (req, res) => {
  const listSlug = req.body.listSlug;
  const email = req.body.email;
  if (!listSlug || !email) throw Error('listSlug or email parameters missing');
  const subscriptions = req.db.collection('subscriptions');
  const response = await subscriptions.findOne({ email, listSlug }, {
    fields: { _id: 0, unsubscribed: 1 },
  });
  res.json(response || { unsubscribed: false });
};
