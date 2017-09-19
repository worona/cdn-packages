import { unique } from 'shorthash';

export default async (req, res) => {
  const { siteId } = req.params;

  // This gets the settings from the database.
  const rawSettings = await req.db
    .collection('settings-live')
    .find(
      {
        'woronaInfo.siteId': siteId,
        'woronaInfo.active': true,
        $or: [
          {
            'woronaInfo.name': 'saturn-app-theme-worona',
          },
          {
            'woronaInfo.name': 'general-app-extension-worona',
          },
          {
            'woronaInfo.name': 'publish-native-app-extension-worona',
          },
          {
            'woronaInfo.name': 'site-general-settings-worona',
          },
        ],
      },
      {
        fields: {
          _id: 0,
          mainColor: 1,
          title: 1,
          name: 1,
          shortName: 1,
          description: 1,
          url: 1,
          appName: 1,
          iconSrc: 1,
        },
      }
    )
    .toArray();

  // This gets the url from the database.
  const sites = await req.db
    .collection('sites')
    .find(
      { _id: siteId },
      {
        fields: {
          _id: 0,
          url: 1,
        },
      }
    )
    .toArray();

  // This reduces the settings to a single object.
  const settings = rawSettings.reduce(
    (final, current) =>
      Object.assign(
        final,
        Object.keys(current).reduce((a, b) => Object.assign(a, { [b]: current[b] }), {})
      ),
    {
      url: sites[0].url,
    }
  );

  // This is the manifest to be sent.
  const manifest = {
    name: settings.name || settings.appName,
    short_name: settings.shortName || settings.appName,
    description: settings.description || '',
    start_url: settings.url,
    theme_color: '#FFF',
    background_color: settings.mainColor || '',
    dir: 'auto',
    display: 'standalone',
    orientation: 'portrait',
    lang: 'es',
    icons: [
      {
        src: `${settings.iconSrc}?profile=android-icon-1024`,
        type: 'image/png',
        sizes: '1024x1024',
      },
      {
        src: `${settings.iconSrc}?profile=android-icon-512`,
        type: 'image/png',
        sizes: '512x512',
      },
      {
        src: `${settings.iconSrc}?profile=android-icon-256`,
        type: 'image/png',
        sizes: '256x256',
      },
      {
        src: `${settings.iconSrc}?profile=android-icon-192`,
        type: 'image/png',
        sizes: '192x192',
      },
      {
        src: `${settings.iconSrc}?profile=android-icon-152`,
        type: 'image/png',
        sizes: '152x152',
      },
      {
        src: `${settings.iconSrc}?profile=android-icon-144`,
        type: 'image/png',
        sizes: '144x144',
      },
      {
        src: `${settings.iconSrc}?profile=android-icon-128`,
        type: 'image/png',
        sizes: '128x128',
      },
      {
        src: `${settings.iconSrc}?profile=android-icon-96`,
        type: 'image/png',
        sizes: '96x96',
      },
      {
        src: `${settings.iconSrc}?profile=android-icon-72`,
        type: 'image/png',
        sizes: '72x72',
      },
      {
        src: `${settings.iconSrc}?profile=android-icon-48`,
        type: 'image/png',
        sizes: '48x48',
      },
      {
        src: `${settings.iconSrc}?profile=android-icon-36`,
        type: 'image/png',
        sizes: '36x36',
      },
    ],
  };

  // This caches the manifest.
  const cacheTag = unique(siteId).substring(0, 3);
  if (cacheTag.length > 128) throw new Error('Cache-Tag is bigger than 128 characters.');

  res.setHeader('Cache-Tag', cacheTag);
  res.json(manifest);
};
