import { spawn } from 'child-process-promise';

export default async ({ name, version }) => {
  await spawn('npm',
    ['install', '--save', '--save-exact', `${name}@${version}`],
    { stdio: 'inherit' }
  );
};
