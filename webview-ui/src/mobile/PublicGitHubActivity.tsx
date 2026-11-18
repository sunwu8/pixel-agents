import { useCallback, useEffect, useState } from 'react';

type Commit = {
  sha: string;
  html_url: string;
  commit?: { message?: string; committer?: { date?: string } };
};

const COMMITS_URL =
  'https://api.github.com/repos/sunwu8/pixel-agents/commits?sha=dev%2Fmobile-office-v1&per_page=5';
const SAFE_COMMIT = /^https:\/\/github\.com\/sunwu8\/pixel-agents\/commit\/[a-f0-9]{40}$/;

/**
 * Read-only public GitHub feed. No private tokens, proxy, or agent state.
 * Mounted in the *real* Pixel Agents mobile menu, not in the companion demo.
 */
export function PublicGitHubActivity({ active }: { active: boolean }) {
  const [entries, setEntries] = useState<Commit[]>([]);
  const [status, setStatus] = useState('Abra o menu para consultar o GitHub.');
  const [loading, setLoading] = useState(false);

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
      if (!Array.isArray(payload)) throw new Error('Resposta inválida');
      const commits = payload.filter((item): item is Commit => {
        if (typeof item !== 'object' || item === null) return false;
        const candidate = item as Partial<Commit>;
        return typeof candidate.sha === 'string' && typeof candidate.html_url === 'string' &&
          SAFE_COMMIT.test(candidate.html_url);
      });
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
    if (!active) return;
    const controller = new AbortController();
    void refresh(controller.signal);
    return () => controller.abort();
  }, [active, refresh]);

  return (
    <section aria-label="Atividade pública do GitHub" className="px-8 py-6 border-t-2 border-border">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base">GitHub · Escritório</h2>
        <button
          type="button"
          className="border-2 border-border px-4 py-2 text-sm disabled:opacity-50"
          disabled={loading}
          onClick={() => void refresh()}
        >
          Atualizar
        </button>
      </div>
      <p role="status" className="text-sm text-text-muted py-3">{status}</p>
      <ul className="flex flex-col gap-3 max-h-40 overflow-y-auto">
        {entries.map((entry) => (
          <li key={entry.sha} className="text-sm break-words">
            <a target="_blank" rel="noopener noreferrer" href={entry.html_url}>
              {entry.commit?.message?.split('\n')[0].slice(0, 100) || entry.sha.slice(0, 8)}
            </a>
          </li>
        ))}
      </ul>
      <p className="text-sm text-text-muted pt-3">
        Somente commits públicos do fork. Não representa o estado de Claude, Codex ou CineDoc privado.
      </p>
    </section>
  );
}
