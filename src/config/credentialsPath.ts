import path from 'path';

const homedir = require('os').homedir();

export const credentialsPath = path.join(homedir, '.aws', 'credentials');
