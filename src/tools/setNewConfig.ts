import { exec } from 'child_process';

import { SessionToken } from '../types/SessionToken';

export const setNewConfig = (sessionToken: SessionToken) => {
  switch (process.platform) {
    case 'win32':
      exec(`set AWS_ACCESS_KEY_ID=${sessionToken.Credentials.AccessKeyId}`);
      exec(`set AWS_SECRET_ACCESS_KEY=${sessionToken.Credentials.SecretAccessKey}`);
      exec(`set AWS_SESSION_TOKEN=${sessionToken.Credentials.SessionToken}`);
      break;
    default:
      exec(`export AWS_ACCESS_KEY_ID${sessionToken.Credentials.AccessKeyId}`);
      exec(`export AWS_SECRET_ACCESS_KEY${sessionToken.Credentials.SecretAccessKey}`);
      exec(`export AWS_SESSION_TOKEN${sessionToken.Credentials.SessionToken}`);
  }
};
