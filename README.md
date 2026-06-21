# @smi0001/agentkit

Interactive launcher for the [`@smi`](https://www.npmjs.com/~smi0001) family of agents and developer tools. One command, a menu, and you're in.

```bash
npx @smi0001/agentkit
```

## What's inside

`agentkit` is a thin launcher. It doesn't reimplement any tool — it bundles the existing published packages and gives you a single entry point with a friendly menu.

| ID         | Tool                                                                       | Underlying package                                                                              |
| ---------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `binod`    | AI-powered PR review (Anthropic)                                           | [`@smi0001/agent-binod`](https://www.npmjs.com/package/@smi0001/agent-binod)                    |
| `webhook`  | Self-hosted webhook capture / inspection server                            | [`@smi0001/webhook-playground`](https://www.npmjs.com/package/@smi0001/webhook-playground)      |
| `db-sync`  | Sync a remote Postgres DB (sandman/UAT) to local + reconcile Sequelize     | [`@smi0001/agent-db-sync`](https://www.npmjs.com/package/@smi0001/agent-db-sync)                |
| `pintu`    | PR call-graph tracer (TS/JS) — emits Mermaid + YAML artifacts              | [`@smi0001/agent-pintu`](https://www.npmjs.com/package/@smi0001/agent-pintu)                    |

More tools are on the way (doc generator, context builder, …). Each will land as its own `@smi0001/agent-*` package and get a one-line registration here.

## Install

```bash
# Run on demand
npx @smi0001/agentkit

# Or install globally
npm i -g @smi0001/agentkit
agentkit         # interactive menu
smi              # alias for the same thing
```

You can also keep using the underlying tools standalone — `@smi0001/agent-binod`, `@smi0001/webhook-playground`, `@smi0001/agent-db-sync`, and `@smi0001/agent-pintu` are independently published and work the same on their own.

## Usage

```bash
agentkit                       # interactive menu
agentkit list                  # list registered tools
agentkit binod                 # run agent-binod
agentkit binod --help          # arguments after the id are forwarded to the tool
agentkit webhook               # start the webhook playground
agentkit db-sync diff          # any subcommand of agent-db-sync
agentkit pintu trace --help    # any subcommand of agent-pintu
agentkit -h                    # help
```

Anything you pass after the tool id is forwarded verbatim to that tool's CLI, so existing flags and workflows keep working.

## Adding a new tool

A "tool" in agentkit is just an entry in [src/plugins.ts](src/plugins.ts):

```ts
{
  id: 'mytool',
  name: 'My new tool',
  description: 'What it does, shown in the menu',
  package: '@smi0001/agent-mytool',     // npm package name
  binName: 'mytool',                // bin field in that package
}
```

Steps:

1. Build and publish the tool as its own npm package (`@smi0001/agent-<name>` is the convention).
2. Add it as a `dependency` in [package.json](package.json).
3. Register it in [src/plugins.ts](src/plugins.ts).
4. Bump agentkit and republish.

Tools are spawned as subprocesses with inherited stdio, so they get full control of the terminal — no special integration needed.

## Development

```bash
npm install
npm start          # run via tsx (no build step)
npm run build      # emit dist/
node dist/index.js # run the built artifact
```

Requires Node 22+ (matches the strictest dependency).

## Roadmap

- `@smi0001/agent-docgen` — documenting agent
- `@smi0001/agent-context` — context-making agent for repos
- `@smi0001/agent-core` — extracted shared primitives (prompt UI, Claude Agent SDK loop, config) once enough tools share code
- LLM-assisted recovery for unknown migration errors in `agent-db-sync`
- Python / Go support for `agent-pintu` (sibling packages, only when a real project triggers the need)

## License

MIT © Shammi Hans
