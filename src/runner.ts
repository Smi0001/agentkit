import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import type { Plugin } from './types.js';

const require = createRequire(import.meta.url);

async function resolveBinPath(plugin: Plugin): Promise<string> {
  const pkgJsonPath = require.resolve(`${plugin.package}/package.json`);
  const pkgDir = dirname(pkgJsonPath);
  const pkg = JSON.parse(await readFile(pkgJsonPath, 'utf8')) as {
    bin?: string | Record<string, string>;
  };
  const binEntry =
    typeof pkg.bin === 'string' ? pkg.bin : pkg.bin?.[plugin.binName];
  if (!binEntry) {
    throw new Error(
      `Package "${plugin.package}" does not declare a bin named "${plugin.binName}"`,
    );
  }
  return resolve(pkgDir, binEntry);
}

export async function runPlugin(
  plugin: Plugin,
  args: string[],
): Promise<number> {
  const binPath = await resolveBinPath(plugin);
  return new Promise<number>((resolveExit, reject) => {
    const child = spawn(process.execPath, [binPath, ...args], {
      stdio: 'inherit',
      env: process.env,
    });
    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (signal) {
        process.kill(process.pid, signal);
        return;
      }
      resolveExit(code ?? 0);
    });
  });
}
