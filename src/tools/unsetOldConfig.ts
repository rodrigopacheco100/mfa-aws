import { readFile, writeFile } from 'fs';
import { promisify } from 'util';
import { credentialsPath } from '../config/credentialsPath';

export const unsetOldConfig = async () => {
  readFile(credentialsPath, async (err, data) => {
    const credentialsWithoutSession = data.toString().split('\n').filter((_, index) => index < 3).reduce((acc, line) => `${acc + line}\n`, '');

    await promisify(writeFile)(
      credentialsPath,
      credentialsWithoutSession,
    );
  });
};
