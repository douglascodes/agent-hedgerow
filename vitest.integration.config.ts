import { defineConfig } from 'vitest/config';

/** Integration tests: boot real VMs through QEMU. Slow, and serial by necessity. */
export default defineConfig({
  test: {
    name: 'integration',
    environment: 'node',
    include: ['test/integration/**/*.test.ts'],

    // VM tests contend for CPU, for the chardev socket, and for the fixed guest
    // CID, so overlapping files would produce failures that look like bugs in
    // the code under test. Run them one at a time.
    fileParallelism: false,

    // A cold QEMU boot is measured in hundreds of milliseconds at best, and the
    // research could not confirm snapshot-fork on every platform — so the budget
    // has to assume a full boot, not a resume.
    testTimeout: 120_000,
    hookTimeout: 120_000,
  },
});
