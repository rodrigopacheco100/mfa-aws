#!/usr/bin/env node

import { Command } from 'commander';
import { exec } from 'child_process';

const program = new Command();

type SessionToken = {
  Credentials: {
    AccessKeyId: string,
    SecretAccessKey: string,
    SessionToken: string,
    Expiration: string
  }
}

program
  .name('aws-mfa-setup')
  .description('AWS MFA configuration manager')
  .version('1.0.0');

program.command('mfa')
  .description('Manage AWS MFA configuration')
  .storeOptionsAsProperties()
  .requiredOption('--secret <secret>', 'your mfa secret')
  .requiredOption('--arn <arn>', 'your arn')
  .action((options) => {
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
  });

program.parse();

const unsetOldConfig = () => {
  switch (process.platform) {
    case 'win32':
      exec('set AWS_ACCESS_KEY_ID=');
      exec('set AWS_SECRET_ACCESS_KEY=');
      exec('set AWS_SESSION_TOKEN=');
      break;
    default:
      exec('unset AWS_ACCESS_KEY_ID');
      exec('unset AWS_SECRET_ACCESS_KEY');
      exec('unset AWS_SESSION_TOKEN');
  }
};

const setNewConfig = (sessionToken: SessionToken) => {
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
