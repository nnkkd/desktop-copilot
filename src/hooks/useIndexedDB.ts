import { useCallback } from "react";

const dbName = "desktop-copilot";
const dbVersion = 1;
const openDB = async (storeName: string): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "key" });
      }
    };

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

const useIndexedDB = <T>(storeName: string) => {
  const getValue = useCallback(
    async (key: string): Promise<T | null> => {
      const db = await openDB(storeName);
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);
        const request = store.get(key);

        request.onsuccess = () => {
          resolve(request.result ? request.result.value : null);
        };

        request.onerror = () => {
          reject(request.error);
        };

        transaction.oncomplete = () => {
          db.close();
        };
      });
    },
    [storeName]
  );

  const setValue = useCallback(
    async (key: string, value: T): Promise<void> => {
      const db = await openDB(storeName);
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);
        const request = store.put({ key, value });

        request.onsuccess = () => resolve();

        request.onerror = () => {
          reject(request.error);
        };

        transaction.oncomplete = () => {
          db.close();
        };
      });
    },
    [storeName]
  );

  return { getValue, setValue };
};

export default useIndexedDB;
