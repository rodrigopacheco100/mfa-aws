import { execute } from './execute';

export const unsetOldConfig = async () => {
  switch (process.platform) {
    case 'win32':
      await execute('set AWS_ACCESS_KEY_ID=');
      await execute('set AWS_SECRET_ACCESS_KEY=');
      await execute('set AWS_SESSION_TOKEN=');
      break;
    default:
      await execute('unset AWS_ACCESS_KEY_ID');
      await execute('unset AWS_SECRET_ACCESS_KEY');
      await execute('unset AWS_SESSION_TOKEN');
  }
};
