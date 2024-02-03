import { useEffect, useState } from "react";
import { Assistant } from "openai/resources/beta/index.mjs";

const Recent = () => {
  const [threadList, setThreadList] = useState<Assistant[]>([]);

  useEffect(() => {
    //TODO: List all threads
  }, []);
  return (
    <div className="w-64">
      <div className="font-bold text-center pb-4 border-b-primary border-b mb-8">
        最近のアクティビティ
      </div>
    </div>
  );
};

export default Recent;
