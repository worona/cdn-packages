export default async (req, res) => {
  const listSlug = req.body.listSlug;
  const email = req.body.email;
  if (!listSlug || !email) return res.json({ error: 'listSlug or email parameters missing' });
  const subscriptions = req.db.collection('subscriptions');
  const response = await subscriptions.findOne({ email, listSlug }, {
    fields: { _id: 0, unsubscribed: 1 },
  });
  return res.json(response || { unsubscribed: false });
};
