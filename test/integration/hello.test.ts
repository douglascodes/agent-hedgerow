import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { greetToFile } from '../../src/hello.js';

describe('greetToFile', () => {
  let sandbox: string;

  beforeEach(async () => {
    sandbox = await mkdtemp(join(tmpdir(), 'hedgerow-hello-'));
  });

  afterEach(async () => {
    await rm(sandbox, { recursive: true, force: true });
  });

  it('writes the greeting to a real file and returns its path', async () => {
    const writtenPath = await greetToFile(sandbox, 'Douglas');

    expect(writtenPath).toBe(join(sandbox, 'greeting.txt'));
    await expect(readFile(writtenPath, 'utf8')).resolves.toBe('Hello, Douglas!');
  });

  it('fails on a directory that does not exist rather than reporting success', async () => {
    const missingDirectory = join(sandbox, 'absent');

    await expect(greetToFile(missingDirectory, 'Douglas')).rejects.toThrow();
  });

  it('refuses to write when the name is blank', async () => {
    await expect(greetToFile(sandbox, '   ')).rejects.toThrow('Cannot greet a blank name');
  });
});
