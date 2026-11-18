/** Validate public GitHub commit payloads before rendering external links. */
export type PublicCommit = {
  sha: string;
  html_url: string;
  commit?: { message?: string; committer?: { date?: string } };
};

const SAFE_COMMIT = /^https:\/\/github\.com\/sunwu8\/pixel-agents\/commit\/([a-f0-9]{40})$/;

export function parsePublicCommits(payload: unknown): PublicCommit[] {
  if (!Array.isArray(payload)) throw new Error('Resposta inválida');
  return payload.filter((item): item is PublicCommit => {
    if (typeof item !== 'object' || item === null) return false;
    const candidate = item as Partial<PublicCommit>;
    if (typeof candidate.sha !== 'string' || typeof candidate.html_url !== 'string') return false;
    const match = SAFE_COMMIT.exec(candidate.html_url);
    return Boolean(match && match[1] === candidate.sha);
  });
}

export function publicCommitTitle(entry: PublicCommit): string {
  const message = entry.commit?.message;
  return typeof message === 'string'
    ? message.split('\n')[0]?.slice(0, 100) || entry.sha.slice(0, 8)
    : entry.sha.slice(0, 8);
}
