import { exec } from 'child_process';

export const unsetOldConfig = () => {
  switch (process.platform) {
    case 'win32':
      exec('set AWS_ACCESS_KEY_ID=');
      exec('set AWS_SECRET_ACCESS_KEY=');
      exec('set AWS_SESSION_TOKEN=');
      break;
    default:
      exec('unset AWS_ACCESS_KEY_ID');
      exec('unset AWS_SECRET_ACCESS_KEY');
      exec('unset AWS_SESSION_TOKEN');
  }
};
