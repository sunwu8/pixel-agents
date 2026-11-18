import { useCallback, useEffect, useState } from 'react';

import { parsePublicCommits, publicCommitTitle, type PublicCommit } from './publicGithubCommits.js';

const COMMITS_URL =
  'https://api.github.com/repos/sunwu8/pixel-agents/commits?sha=dev%2Fmobile-office-v1&per_page=5';

/**
 * Read-only public GitHub feed. No private tokens, proxy, or agent state.
 * Mounted in the *real* Pixel Agents mobile menu, not in the companion demo.
 */
export function PublicGitHubActivity({ active }: { active: boolean }) {
  const [entries, setEntries] = useState<PublicCommit[]>([]);
  const [status, setStatus] = useState('Abra o menu para consultar o GitHub.');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const refresh = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setStatus('Buscando commits públicos...');
    try {
      const response = await fetch(COMMITS_URL, {
        headers: { Accept: 'application/vnd.github+json' },
        signal,
        cache: 'no-store',
      });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const payload: unknown = await response.json();
      const commits = parsePublicCommits(payload);
      if (signal?.aborted) return;
      setEntries(commits);
      setStatus(commits.length ? 'Dados reais do GitHub público.' : 'Nenhum commit encontrado.');
    } catch (error) {
      if (signal?.aborted) return;
      setStatus('Não foi possível consultar o GitHub (' +
        (error instanceof Error ? error.message.slice(0, 40) : 'erro de rede') + ').');
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!active || !expanded) return;
    const controller = new AbortController();
    void refresh(controller.signal);
    return () => controller.abort();
  }, [active, expanded, refresh]);

  return (
    <section aria-label="Atividade pública do GitHub" className="border-t-2 border-border">
      <button
        type="button"
        className="w-full flex items-center justify-between gap-4 px-8 py-5 text-left"
        aria-expanded={expanded}
        onClick={() => setExpanded((value) => !value)}
      >
        <span className="text-base">GitHub · Escritório</span>
        <span aria-hidden="true">{expanded ? '−' : '+'}</span>
      </button>
      {expanded && (
        <div className="px-8 pb-6">
          <p role="status" className="text-sm text-text-muted pb-3">{status}</p>
          <button
            type="button"
            className="border-2 border-border px-4 py-2 text-sm disabled:opacity-50"
            disabled={loading}
            onClick={() => void refresh()}
          >
            Atualizar
          </button>
          <ul className="flex flex-col gap-3 max-h-40 overflow-y-auto py-3">
            {entries.map((entry) => (
              <li key={entry.sha} className="text-sm break-words">
                <a target="_blank" rel="noopener noreferrer" href={entry.html_url}>
                  {publicCommitTitle(entry)}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-sm text-text-muted">
            Apenas commits públicos. Não é um monitor de sessões locais dos agentes.
          </p>
        </div>
      )}
    </section>
  );
}
