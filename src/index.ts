#!/usr/bin/env node

import { Command } from 'commander';

import { SessionToken } from './types/SessionToken';

import { version } from '../package.json';
import { unsetOldConfig } from './tools/unsetOldConfig';
import { setNewConfig } from './tools/setNewConfig';
import { execute } from './tools/execute';

const program = new Command();

program
  .name('mfa-aws')
  .description('AWS MFA configuration manager')
  .version(version)
  .requiredOption('--secret <secret>', 'your mfa secret')
  .requiredOption('--arn <arn>', 'your arn')
  .parse(process.argv);

const options = program.opts();

const run = async () => {
  await unsetOldConfig();

  const { stdout, stderr } = await execute(`aws sts get-session-token --duration-seconds 28800 --serial-number ${options.arn} --token-code ${options.secret}`);

  if (stderr) {
    console.log(`stderr: ${stderr}`);
    return;
  }

  const sessionToken: SessionToken = JSON.parse(stdout);

  console.log(sessionToken);

  await setNewConfig(sessionToken);
};

run()
  .then(() => console.log('Successfully settled session token'))
  .catch((error) => console.log('error: ', error));
