import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Placeholder module proving the test harness end to end. It exists so both
 * suites have something real to run against, and is meant to be deleted once
 * the VM substrate lands its first actual module.
 */

/** Builds a greeting for the given name, ignoring surrounding whitespace. */
export function greet(name: string): string {
  const trimmedName = name.trim();

  if (trimmedName === '') {
    throw new Error('Cannot greet a blank name');
  }

  return `Hello, ${trimmedName}!`;
}

/** Writes a greeting for the given name into the directory, returning the path written. */
export async function greetToFile(directory: string, name: string): Promise<string> {
  const greetingPath = join(directory, 'greeting.txt');

  await writeFile(greetingPath, greet(name), 'utf8');

  return greetingPath;
}
