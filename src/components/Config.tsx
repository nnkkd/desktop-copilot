import { useContext, useEffect, useState } from "react";
import { ConfigContext } from "../context/ConfigContext";
import OpenAI from "openai";
import { Assistant } from "openai/resources/beta/index.mjs";

type Props = {
  openAiClient: OpenAI | null;
};

const Config = (props: Props) => {
  const config = useContext(ConfigContext);
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  useEffect(() => {
    if (props.openAiClient) {
      props.openAiClient.beta.assistants.list().then((agents) => {
        setAssistants(agents.data);
      });
    }
  }, [config.apiKey, props.openAiClient]);
  return (
    <>
      <input
        className="block border-gray-300 border p-2 ml-auto mb-2 w-full"
        placeholder="sk-..."
        type="password"
        value={config.apiKey}
        onChange={(e) => config.setApiKey(e.target.value)}
      ></input>
      <select
        className="block border-gray-300 border p-2 mr-auto w-full"
        value={config.assistantId}
        onChange={(e) => config.setAssistantId(e.target.value)}
      >
        {assistants.map((assistant) => {
          return (
            <option key={assistant.id} value={assistant.id}>
              {assistant.name}
            </option>
          );
        })}
      </select>
    </>
  );
};

export default Config;
