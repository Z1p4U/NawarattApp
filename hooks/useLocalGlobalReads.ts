import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@global_reads_v1";

export default function useLocalGlobalReads() {
  // store as Set<string> for O(1) checks
  const [readSet, setReadSet] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  // load persisted reads once on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!mounted) return;
        if (raw) {
          const arr = JSON.parse(raw) as string[] | null;
          if (Array.isArray(arr)) {
            setReadSet(new Set(arr.map((n) => String(n)).filter(Boolean)));
          } else {
            setReadSet(new Set());
          }
        } else {
          setReadSet(new Set());
        }
      } catch (err) {
        console.warn("useLocalGlobalReads load error", err);
        setReadSet(new Set());
      } finally {
        if (mounted) setReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const persist = useCallback(async (set: Set<string>) => {
    try {
      const arr = Array.from(set.values());
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    } catch (err) {
      console.warn("useLocalGlobalReads persist error", err);
    }
  }, []);

  const markRead = useCallback(
    async (id: string) => {
      if (!id) return;
      setReadSet((prev) => {
        if (prev.has(id)) return prev;
        const next = new Set(prev);
        next.add(String(id));
        // fire-and-forget persist (await not required by caller)
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const markAllRead = useCallback(
    async (ids: string[] | Set<string>) => {
      const idArr = Array.isArray(ids) ? ids : Array.from(ids);
      const numeric = idArr.map((n) => String(n)).filter(Boolean);
      if (!numeric.length) return;
      setReadSet((prev) => {
        const next = new Set(prev);
        numeric.forEach((n) => next.add(n));
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const clear = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn("useLocalGlobalReads clear error", err);
    }
    setReadSet(new Set());
  }, []);

  return {
    ready,
    readSet,
    isRead: (id?: string | null) => !!(id && readSet.has(String(id))),
    markRead,
    markAllRead,
    clear,
  };
}
