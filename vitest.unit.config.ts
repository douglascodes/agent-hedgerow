import { defineConfig } from 'vitest/config';

/** Unit tests: pure logic only. No VM, no QEMU, no sockets, no network. */
export default defineConfig({
  test: {
    name: 'unit',
    environment: 'node',
    include: ['src/**/*.test.ts', 'test/unit/**/*.test.ts'],
  },
});
