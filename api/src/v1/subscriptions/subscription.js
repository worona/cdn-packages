import Mixpanel from 'mixpanel';
import config from '../../../config.json';

export default async (req, res) => {
  const listSlug = req.body.listSlug;
  const email = req.body.email;
  const status = req.params.status;
  const unsubscribed = status === 'unsubscribe';

  const subscriptions = req.db.collection('subscriptions');
  const lists = req.db.collection('lists');
  const users = req.db.collection('users');

  if (!listSlug || !email) return res.json({ error: 'listSlug or email parameters missing' });

  if (status !== 'subscribe' && status !== 'unsubscribe')
    return res.json({ error: 'Use only subscribe or unsubscribe options.' });

  const list = await lists.findOne({ slug: listSlug });
  if (!list) return res.json({ error: `The list with slug ${listSlug} is not in the database.` });

  let distinctId = email;
  let userId = null;
  if (list.convertTouserId) {
    const user = await users.findOne({ 'emails.0.address': email }, { fields: { _id: 1 } });
    if (!user) return res.json({ error: 'User with this email address not found in the database' });
    userId = user._id;
    distinctId = userId;
  }

  const response = userId
    ? await subscriptions.update({ userId, listSlug }, { userId, email, listSlug, unsubscribed }, {
        upsert: true,
      })
    : await subscriptions.update({ email, listSlug }, { email, listSlug, unsubscribed }, {
        upsert: true,
      });
  if (response.result.ok !== 1)
    return res.json({ error: 'Unable to save the subscription to the database.' });

  if (list.service === 'mixpanel') {
    const mixpanel = Mixpanel.init(config.mixpanel[list.project], { protocol: 'https' });
    const payload = {
      distinct_id: distinctId,
      userId,
      email,
      listSlug,
      unsubscribed,
      listName: list.name,
    };
    const event = status === 'subscribe' ? 'SUBSCRIBED' : 'UNSUBSCRIBED';
    mixpanel.track(`${event} - ${listSlug}`, payload);
    mixpanel.people.set(distinctId, {
      [`unsubscribed_from_${listSlug}`]: unsubscribed,
    });
    if (!list.convertTouserId) {
      mixpanel.people.set_once(distinctId, {
        $email: email,
      });
    }
    return res.json({ unsubscribed, listName: list.name });
  }

  return res.json({ error: 'Only mixpanel subscriptions are supported yet.' });
};
