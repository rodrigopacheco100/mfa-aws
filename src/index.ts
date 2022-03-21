#!/usr/bin/env node

import { Command } from 'commander';
import { promisify } from 'util';
import { exec } from 'child_process';

import { SessionToken } from './types/SessionToken';

import { version } from '../package.json';
import { unsetOldConfig } from './tools/unsetOldConfig';
import { setNewConfig } from './tools/setNewConfig';

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

  const { stdout, stderr } = await promisify(exec)(`aws sts get-session-token --duration-seconds 28800 --serial-number ${options.arn} --token-code ${options.secret}`);

  if (stderr) {
    console.log(`stderr: ${stderr}`);
    return;
  }

  const sessionToken: SessionToken = JSON.parse(stdout);

  await setNewConfig(sessionToken);
};

run()
  .then(() => console.log('Successfully settled session token'))
  .catch((error) => console.log('error: ', error));
