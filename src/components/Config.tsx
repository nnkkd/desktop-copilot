import { useContext, useState } from "react";
import { ConfigContext } from "../context/ConfigContext";

const Config = () => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const config = useContext(ConfigContext);
  return (
    <>
      <div className="z-10 absolute top-0 right-0 mx-1 my-1">
        <button
          onClick={() => setIsConfigOpen((prev) => !prev)}
          className="border-primary font-bold py-2 px-4 border bg-white"
        >
          Open Config
        </button>
      </div>
      {isConfigOpen && (
        <div className="z-10 mt-16 absolute border border-primary top-0 right-0 mx-1 px-1 py-1 bg-white">
          <div className="mb-4">
            OpenAI API Key:
            <input
              className="block border-gray-300 border p-2 ml-auto"
              placeholder="sk-..."
              type="password"
              value={config.apiKey}
              onChange={(e) => config.setApiKey(e.target.value)}
            ></input>
          </div>
          <div className="mb-4">
            Assistant ID:
            <input
              className="block border-gray-300 border p-2 ml-auto"
              placeholder="asst_..."
              value={config.assistantId}
              onChange={(e) => config.setAssistantId(e.target.value)}
            ></input>
          </div>
        </div>
      )}
    </>
  );
};

export default Config;
