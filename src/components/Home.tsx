import Recent from "./Recent";
import Chat from "./Chat";
import { useContext, useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStrage";
import { ThreadMessage } from "openai/resources/beta/threads/index.mjs";
import OpenAI from "openai";
import { ConfigContext } from "../context/ConfigContext";

const Home = () => {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [recentActivity, setRecentActivity] = useLocalStorage<Array<string>>(
    "recent",
    []
  );
  const [messages, setMessages] = useState<Array<ThreadMessage>>([]);
  const [openAiClient, setOpenAiClient] = useState<OpenAI | null>(null);
  const config = useContext(ConfigContext);

  useEffect(() => {
    if (config.apiKey && config.assistantId) {
      const client = new OpenAI({
        apiKey: config.apiKey,
        dangerouslyAllowBrowser: true,
      });
      setOpenAiClient(client);
    }
  }, [config.apiKey, config.assistantId]);

  return (
    <div className="flex">
      <div className="flex-1">
        <Chat
          selectedThreadId={selectedThreadId}
          setSelectedThreadId={setSelectedThreadId}
          setRecentActivity={setRecentActivity}
          messages={messages}
          setMessages={setMessages}
          openAiClient={openAiClient}
        />
      </div>
      <div className="flex justify-end">
        <div className="md:block hidden mt-16">
          <Recent
            selectedThreadId={selectedThreadId}
            setSelectedThreadId={setSelectedThreadId}
            recentActivity={recentActivity}
            setMessages={setMessages}
            openAiClient={openAiClient}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
