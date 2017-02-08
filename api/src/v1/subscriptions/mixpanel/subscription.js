import Mixpanel from 'mixpanel';
import config from '../../../../config.json';

export default async (req, res) => {
  const listSlug = req.body.listSlug;
  const email = req.body.email;
  if (!listSlug || !email) throw Error('listSlug or email parameters missing');
  const status = req.params.status;
  if (status !== 'subscribe' && status !== 'unsubscribe')
    throw Error('Use only subscribe or unsubscribe options.');
  const subscriptions = req.db.collection('subscriptions');
  const lists = req.db.collection('lists');
  const { name: listName } = await lists.findOne({ slug: listSlug });
  const unsubscribed = status === 'unsubscribe';
  const response = await subscriptions.update(
    { email, listSlug },
    { email, listSlug, unsubscribed },
    { upsert: true },
  );
  if (response.result.ok !== 1) throw new Error('Unable to save the subscription to the database.');
  const mixpanel = Mixpanel.init(config.mixpanel[req.params.env], { protocol: 'https' });
  const payload = { distinct_id: email, email, listSlug, unsubscribed, listName };
  const event = status === 'subscribe' ? 'SUBSCRIBED' : 'UNSUBSCRIBED';
  mixpanel.track(`${event} - ${listName}`, payload);
  mixpanel.people.set(email, {
    [`unsubscribed_from_${listSlug}`]: unsubscribed,
  });
  res.json({ unsubscribed });
};
