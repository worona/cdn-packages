import md5 from 'md5';
import { generateManifest } from './chcp-manifest';

export default async (req, res) => {
  const siteId = req.params.siteId;
  const manifest = await generateManifest({ siteId });
  const release = md5(JSON.stringify(manifest));
  res.json({
    content_url: `https://cdn.worona.io/api/v1/chcp/site/${siteId}/`,
    release,
  });
};
