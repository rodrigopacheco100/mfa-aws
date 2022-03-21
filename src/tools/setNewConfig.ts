import { SessionToken } from '../types/SessionToken';
import { execute } from './execute';

export const setNewConfig = async (sessionToken: SessionToken) => {
  switch (process.platform) {
    case 'win32':
      await execute(`set AWS_ACCESS_KEY_ID=${sessionToken.Credentials.AccessKeyId}`);
      await execute(`set AWS_SECRET_ACCESS_KEY=${sessionToken.Credentials.SecretAccessKey}`);
      await execute(`set AWS_SESSION_TOKEN=${sessionToken.Credentials.SessionToken}`);
      break;
    default:
      await execute(`export AWS_ACCESS_KEY_ID=${sessionToken.Credentials.AccessKeyId}`);
      await execute(`export AWS_SECRET_ACCESS_KEY=${sessionToken.Credentials.SecretAccessKey}`);
      await execute(`export AWS_SESSION_TOKEN=${sessionToken.Credentials.SessionToken}`);
  }
};
