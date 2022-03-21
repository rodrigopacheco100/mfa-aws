import { exec } from 'child_process';
import { promisify } from 'util';

export const execute = (command: string) => promisify(exec)(command);
