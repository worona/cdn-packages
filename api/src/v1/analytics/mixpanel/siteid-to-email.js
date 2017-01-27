import Mixpanel from 'mixpanel';
import config from '../../../../config.json';

export default async (req, res) => {
  const { siteId, event, ...props } = req.query;
  const sites = req.db.collection('sites');
  const users = req.db.collection('users');

  const site = await sites.findOne({ _id: siteId }, { fields: { userIds: 1 } });
  const userId = site.userIds[0];

  const user = await users.findOne({ _id: userId }, { fields: { emails: 1 } });
  const email = user.emails[0].address;

  const mixpanel = Mixpanel.init(config.mixpanel[req.params.env], { protocol: 'https' });

  const payload = { distinct_id: email, ...props };

  mixpanel.track(event, { ...payload });

  res.json({ event, ...payload });
};
