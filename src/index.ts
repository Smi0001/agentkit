#!/usr/bin/env node
import * as p from '@clack/prompts';
import { plugins, findPlugin } from './plugins.js';
import { runPlugin } from './runner.js';

const HELP = `
@smi0001/agentkit — interactive launcher for the @smi0001 family of tools

Usage:
  agentkit                    Launch interactive menu
  agentkit <id> [args...]     Run a registered tool directly (args are forwarded)
  agentkit list               List registered tools
  agentkit -h, --help         Show this help

Registered tools:
${plugins.map((pl) => `  ${pl.id.padEnd(10)} ${pl.description}`).join('\n')}

Examples:
  agentkit
  agentkit binod --help
  agentkit webhook
`.trim();

async function main() {
  const argv = process.argv.slice(2);

  if (argv.length === 0) {
    await interactive();
    return;
  }

  const [first, ...rest] = argv;

  if (first === '-h' || first === '--help' || first === 'help') {
    console.log(HELP);
    return;
  }

  if (first === 'list') {
    for (const plugin of plugins) {
      console.log(`${plugin.id.padEnd(10)} ${plugin.description}`);
    }
    return;
  }

  const plugin = findPlugin(first);
  if (!plugin) {
    console.error(`Unknown tool: "${first}"\n`);
    console.error(HELP);
    process.exit(2);
  }

  const code = await runPlugin(plugin, rest);
  process.exit(code);
}

async function interactive() {
  p.intro('@smi0001/agentkit');

  const choice = await p.select({
    message: 'What do you want to launch?',
    options: [
      ...plugins.map((plug) => ({
        value: plug.id,
        label: plug.name,
        hint: plug.description,
      })),
      { value: '__exit', label: 'Exit', hint: '' },
    ],
  });

  if (p.isCancel(choice) || choice === '__exit') {
    p.cancel('Bye.');
    return;
  }

  const plugin = findPlugin(String(choice));
  if (!plugin) {
    p.cancel(`Unknown plugin: ${String(choice)}`);
    process.exit(2);
  }

  p.outro(`Launching ${plugin.name}…`);
  const code = await runPlugin(plugin, []);
  process.exit(code);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
