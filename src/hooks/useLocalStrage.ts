import { useState, useEffect } from "react";

// useLocalStorage カスタムフックの実装
function useLocalStorage<T>(key: string, initialValue: T) {
  // ステートを初期化する関数。初回レンダリング時にローカルストレージから値を読み込む
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      // ローカルストレージに値があればそれを返し、なければ初期値を返す
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  // ステートを更新する関数。この関数はステートを更新し、その値をローカルストレージにも保存する
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // 値が関数かどうかを判定し、適切にステートを更新
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // ステートを更新
      setStoredValue(valueToStore);
      // ローカルストレージに値を保存
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
}

export default useLocalStorage;
