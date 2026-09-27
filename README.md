# agent-hedgerow

Isolate LLM agents inside virtual machines, so that an agent's reachable world is the guest rather than the host.

Container sandboxing is rejected as the isolation boundary — too many escape vectors to configure correctly. The agent runs in a VM, and a separate mediator grants it the specific access a task needs.

## Requirements

- **Node 24** — see `.nvmrc`. Run `nvm use` if your shell is on an older version.
- **Corepack enabled** — `corepack enable`. `package.json` pins `yarn@4.18.1`; without corepack the global `yarn` is v1 and will refuse to run in this project.

## Commands

| Command | Purpose |
| --- | --- |
| `yarn test` | Unit suite, then integration suite |
| `yarn test:unit` | Fast. Pure logic only — no VM, no QEMU, no sockets |
| `yarn test:integration` | Boots real QEMU VMs. Serial and slow |
| `yarn test:watch` | Unit suite in watch mode |
| `yarn typecheck` | `tsc --noEmit` |
| `yarn lint` | Biome check — lint, formatting, and import order |
| `yarn lint:fix` | Same, applying fixes |
| `yarn format` | Rewrite files with the formatter |
| `yarn format:check` | Verify formatting without writing |

Both test suites exit non-zero when no test file matches. That is deliberate: a suite that reports success with zero tests is a vacuous pass, and this project treats those as worse than no test at all.

## Test layout

- `vitest.unit.config.ts` — `src/**/*.test.ts` and `test/unit/**/*.test.ts`. Unit tests live beside the code they cover.
- `vitest.integration.config.ts` — `test/integration/**/*.test.ts`. These boot VMs, so they run one file at a time and get a two-minute budget per test.

Integration tests will require a working QEMU once the VM substrate lands. The supervisor discovers QEMU rather than hardcoding a path, since a contributor's own build will live wherever they put it.

## Status

Pre-implementation. The design — substrate, capabilities, phases, and platform constraints — is written up in the project plan; the repository holds only tooling so far.
