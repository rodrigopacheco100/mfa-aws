import { appendFile } from 'fs';
import { promisify } from 'util';
import { credentialsPath } from '../config/credentialsPath';
import { SessionToken } from '../types/SessionToken';

export const setNewConfig = async (sessionToken: SessionToken) => {
  await promisify(appendFile)(
    credentialsPath,
    `\naws_access_key_id = ${sessionToken.Credentials.AccessKeyId}\naws_secret_access_key = ${sessionToken.Credentials.SecretAccessKey}\naws_session_token = ${sessionToken.Credentials.SessionToken}`,
  );
};
