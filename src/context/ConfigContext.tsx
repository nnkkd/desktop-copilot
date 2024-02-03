import React from "react";
import useLocalStorage from "../hooks/useLocalStrage";

export const ConfigContext = React.createContext({
  apiKey: "",
  setApiKey: (_: string) => {},
  assistantId: "",
  setAssistantId: (_: string) => {},
});

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const [apiKey, setApiKey] = useLocalStorage("openai-api-key", "");
  const [assistantId, setAssistantId] = useLocalStorage(
    "openai-assistant-id",
    ""
  );

  return (
    <ConfigContext.Provider
      value={{ apiKey, setApiKey, assistantId, setAssistantId }}
    >
      {children}
    </ConfigContext.Provider>
  );
};
