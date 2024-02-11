import { useEffect, useState } from "react";
import useIndexedDB from "./useIndexedDB";

export const useRecentThreads = (assistantId: string) => {
  const { getValue, setValue } =
    useIndexedDB<Array<RecentThread>>("recent_activity");
  const [recentThreads, setRecentThreads] = useState<Array<RecentThread>>([]);

  useEffect(() => {
    const getRecentThreads = async () => {
      const value = await getValue(assistantId);
      if (value) {
        setRecentThreads(value);
      } else {
        setRecentThreads([]);
      }
    };
    getRecentThreads();
  }, [assistantId]);

  const addRecentThreads = async (thread: RecentThread) => {
    const value = await getValue(assistantId);
    if (value) {
      await setValue(assistantId, [thread, ...value]);
      setRecentThreads([thread, ...value]);
    } else {
      await setValue(assistantId, [thread]);
      setRecentThreads([thread]);
    }
  };
  return { recentThreads, addRecentThreads };
};
