import { describe, expect, it } from 'vitest';

import { parsePublicCommits, publicCommitTitle } from '../src/mobile/publicGithubCommits.js';

const sha = 'a'.repeat(40);
const valid = {
  sha,
  html_url: 'https://github.com/sunwu8/pixel-agents/commit/' + sha,
  commit: { message: 'Primeira linha\nDescrição detalhada' },
};

describe('publicGithubCommits', () => {
  it('accepts real-looking commits belonging to the public fork', () => {
    expect(parsePublicCommits([valid])).toEqual([valid]);
  });

  it('rejects unexpected hosts, other repos, and SHA mismatches', () => {
    const malicious = [
      { ...valid, html_url: 'https://example.com/sunwu8/pixel-agents/commit/' + sha },
      { ...valid, html_url: 'https://github.com/sunwu8/CineDoc-Engine/commit/' + sha },
      { ...valid, sha: 'b'.repeat(40) },
      null,
      'random',
    ];
    expect(parsePublicCommits(malicious)).toEqual([]);
  });

  it('rejects an invalid response instead of guessing', () => {
    expect(() => parsePublicCommits({ error: 'rate limit' })).toThrow('Resposta inválida');
  });

  it('shows only the first line of a commit message', () => {
    expect(publicCommitTitle(valid)).toBe('Primeira linha');
  });

  it('falls back to the short SHA when message is absent', () => {
    expect(publicCommitTitle({ sha, html_url: valid.html_url })).toBe('aaaaaaaa');
  });
});
