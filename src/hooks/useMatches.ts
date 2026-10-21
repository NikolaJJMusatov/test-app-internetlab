import { useCallback, useEffect, useState } from 'react';
import { parseMatches } from '../api/parseMatches';
import { MATCHES_URL } from '../config';
import type { Match } from '../types/match';

export type MatchesState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; matches: Match[] };

const LOAD_ERROR = 'Не удалось загрузить матчи. Проверьте сеть и нажмите «Повторить».';

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

export function useMatches() {
  const [state, setState] = useState<MatchesState>({ status: 'loading' });
  const [requestId, setRequestId] = useState(0);

  const reload = useCallback(() => {
    setState({ status: 'loading' });
    setRequestId((id) => id + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const response = await fetch(MATCHES_URL, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(LOAD_ERROR);
        }
        const payload: unknown = await response.json();
        const matches = parseMatches(payload);
        if (!controller.signal.aborted) {
          setState({ status: 'success', matches });
        }
      } catch (error) {
        if (controller.signal.aborted || isAbortError(error)) {
          return;
        }
        setState({ status: 'error', message: LOAD_ERROR });
      }
    }

    void load();

    return () => {
      controller.abort();
    };
  }, [requestId]);

  return { state, reload };
}
