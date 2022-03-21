import path from 'path';
import { homedir } from 'os';

export const credentialsPath = path.join(homedir(), '.aws', 'credentials');
