# agent-hedgerow

Isolate LLM agents inside virtual machines, so that an agent's reachable world is the guest rather than the host.

Container sandboxing is rejected as the isolation boundary — too many escape vectors to configure correctly. The agent runs in a VM, and a separate mediator grants it the specific access a task needs.

## Requirements

- **Node 24** — see `.nvmrc`. Run `nvm use` if your shell is on an older version.
- **Corepack enabled** — `corepack enable`. `package.json` pins `yarn@4.18.1`; without corepack the global `yarn` is v1 and will refuse to run in this project.

## Commands

| Command | Purpose |
| --- | --- |
| `yarn test` | Both projects |
| `yarn test:unit` | Fast. Pure logic only — no VM, no QEMU, no sockets |
| `yarn test:integration` | Boots real QEMU VMs. Serial and slow |
| `yarn test:debug` | Both projects, watch mode |
| `yarn test:unit:debug` | Unit project, watch mode |
| `yarn test:integration:debug` | Integration project, watch mode |
| `yarn typecheck` | `tsc --noEmit` |
| `yarn lint` | Biome check — lint, formatting, and import order |
| `yarn lint:fix` | Same, applying fixes |
| `yarn format` | Rewrite files with the formatter |
| `yarn format:check` | Verify formatting without writing |

Both test suites exit non-zero when no test file matches. That is deliberate: a suite that reports success with zero tests is a vacuous pass, and this project treats those as worse than no test at all.

## Pre-commit hook

A husky `pre-commit` hook runs `lint-staged`, which formats and lints only the staged files and re-stages whatever it fixed. The commit is refused on any lint error *or warning* — `biome check` exits 0 on warnings by default, so `--error-on-warnings` is set explicitly. Without it, `noExplicitAny` and unused variables would pass through silently.

Two behaviours worth knowing:

- **Partially staged files.** lint-staged stashes unstaged hunks before running, so only the content you actually staged is formatted and committed. Without that, a hook would silently commit work you hadn't staged.
- **Automatic install.** The `prepare` script wires the hook up on `yarn install`. Nothing manual, per clone.

`git commit --no-verify` bypasses it. That is an escape hatch for a broken hook, not a routine override — a commit that skips it has not been linted.

## Test layout

A single `vitest.config.ts` declares two projects, so both suites share one entry point while keeping rules that genuinely differ:

- **`unit`** — `src/**/*.test.ts` and `test/unit/**/*.test.ts`. Fast and parallel; unit tests live beside the code they cover.
- **`integration`** — `test/integration/**/*.test.ts`. These boot VMs, so they run one file at a time and get a two-minute budget per test.

`yarn test` runs both projects. Selecting one is `--project unit` or `--project integration`, which the `test:unit` and `test:integration` scripts wrap.

Integration tests will require a working QEMU once the VM substrate lands. The supervisor discovers QEMU rather than hardcoding a path, since a contributor's own build will live wherever they put it.

## Status

Pre-implementation. The design — substrate, capabilities, phases, and platform constraints — is written up in the project plan; the repository holds only tooling so far.
