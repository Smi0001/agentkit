import type { Plugin } from './types.js';

export const plugins: Plugin[] = [
  {
    id: 'binod',
    name: 'Review a PR (binod)',
    description: 'AI-powered PR review using agent-binod',
    package: '@smi0001/agent-binod',
    binName: 'agent-binod',
    argsHint: 'agentkit binod [...binod args]',
  },
  {
    id: 'webhook',
    name: 'Webhook playground',
    description: 'Self-hosted webhook capture/inspection server',
    package: '@smi0001/webhook-playground',
    binName: 'webhook-play',
    argsHint: 'agentkit webhook [...webhook-play args]',
  },
  {
    id: 'db-sync',
    name: 'Sync a Postgres DB (db-sync)',
    description: 'Sync sandman/UAT Postgres to local with Sequelize migration reconciliation',
    package: '@smi0001/agent-db-sync',
    binName: 'agent-db-sync',
    argsHint: 'agentkit db-sync [...db-sync args]',
  },
  {
    id: 'pintu',
    name: 'Trace a PR (pintu)',
    description: 'Static call-graph trace of a PR diff (TS/JS) → Mermaid + YAML artifacts',
    package: '@smi0001/agent-pintu',
    binName: 'agent-pintu',
    argsHint: 'agentkit pintu [...pintu args]',
  },
];

export function findPlugin(idOrName: string): Plugin | undefined {
  return plugins.find((p) => p.id === idOrName || p.name === idOrName);
}
