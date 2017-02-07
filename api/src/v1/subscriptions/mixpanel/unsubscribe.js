import Mixpanel from 'mixpanel';
import config from '../../../../config.json';

export default async (req, res) => {
  const list = req.body.list;
  const email = req.body.email;
  const subscriptions = req.db.collection('subscriptions');
  const lists = req.db.collection('lists');
  const { name: listName } = await lists.findOne({ slug: list });
  const { ok } = await subscriptions.update(
    {
      email,
      list,
    },
    {
      email,
      list,
      subscribed: false,
    },
    {
      upsert: true,
    },
  );
  const mixpanel = Mixpanel.init(config.mixpanel[req.params.env], { protocol: 'https' });
  const payload = { distinct_id: email, list };
  mixpanel.track(`UNSUBSCRIBED - ${listName}`, { ...payload });
  res.json({ ok });
};
