"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

/** Generic GET hook: refetches whenever `path`/`params` change, or `refetch()` is called. */
export function useApiQuery(path, params, deps = []) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadIndex, setReloadIndex] = useState(0);

  const refetch = useCallback(() => setReloadIndex((n) => n + 1), []);

  useEffect(() => {
    if (!path) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setData(null);
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    api
      .get(path, params)
      .then((res) => {
        if (!cancelled) setData(res.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, JSON.stringify(params), reloadIndex, ...deps]);

  return { data, isLoading, error, refetch };
}
