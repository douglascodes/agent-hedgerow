import { defineConfig } from 'vitest/config';

/** Two suites with genuinely different shapes: unit is fast and parallel, integration boots VMs. */
export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          environment: 'node',
          include: ['src/**/*.test.ts', 'test/unit/**/*.test.ts'],
        },
      },
      {
        test: {
          name: 'integration',
          environment: 'node',
          include: ['test/integration/**/*.test.ts'],

          // VM tests contend for CPU, the chardev socket, and the guest CID, so
          // overlapping files would fail in ways that look like bugs in the code
          // under test. Run them one at a time.
          fileParallelism: false,

          // A cold QEMU boot is hundreds of milliseconds at best, and snapshot-fork
          // is unverified on macOS — so the budget assumes a full boot, not a resume.
          testTimeout: 120_000,
          hookTimeout: 120_000,
        },
      },
    ],
  },
});
