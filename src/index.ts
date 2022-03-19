#!/usr/bin/env node

import { Command } from 'commander';
import { exec } from 'child_process';

import { SessionToken } from './types/SessionToken';

import { unsetOldConfig } from './tools/unsetOldConfig';
import { setNewConfig } from './tools/setNewConfig';

const program = new Command();

program
  .name('mfa-aws')
  .description('AWS MFA configuration manager')
  .version('1.0.0')
  .requiredOption('--secret <secret>', 'your mfa secret')
  .requiredOption('--arn <arn>', 'your arn')
  .parse(process.argv);

const options = program.opts();

exec(`aws sts get-session-token --duration-seconds 28800 --serial-number ${options.arn} --token-code ${options.secret}`, (error, stdout, stderr) => {
  if (error) {
    console.log(`error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.log(`stderr: ${stderr}`);
    return;
  }

  const sessionToken: SessionToken = JSON.parse(stdout);

  unsetOldConfig();

  setNewConfig(sessionToken);

  console.log('Successfully settled session token:', sessionToken.Credentials);
});
