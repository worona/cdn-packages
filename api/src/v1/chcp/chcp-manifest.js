import md5 from 'md5';
import { readFileSync } from 'fs';

export const generateManifest = async ({ siteId }) => {
  const file = readFileSync('../packages/dist/worona-cordova-index/index.html', 'utf8');
  const hash = md5(file);
  return [ { file: 'index.html', hash } ];
}

export default async (req, res) => {
  const siteId = req.params.siteId;
  const manifest = await generateManifest({ siteId });
  res.json(manifest);
};
