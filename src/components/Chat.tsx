import { Dispatch, useContext, useState } from "react";
import InitialScreen from "./InitialScreen";
import InputBox from "./InputBox";
import { ConfigContext } from "../context/ConfigContext";
import OpenAI from "openai";
import { ThreadMessage } from "openai/resources/beta/threads/index.mjs";
import MessageList from "./MessageList";

type Props = {
  selectedThreadId: string | null;
  setSelectedThreadId: Dispatch<React.SetStateAction<string | null>>;
  addRecentThreads: (value: RecentThread) => Promise<void>;
  messages: Array<ThreadMessage>;
  setMessages: Dispatch<React.SetStateAction<Array<ThreadMessage>>>;
  openAiClient: OpenAI | null;
};

const Chat = (props: Props) => {
  const config = useContext(ConfigContext);
  const [userInput, setUserInput] = useState<string>("");

  const handleSendMessage = async () => {
    let threadId: string;
    if (props.openAiClient && userInput.length > 0) {
      const openAiClient = props.openAiClient;
      if (props.selectedThreadId === null) {
        const response = await openAiClient.beta.threads.create({
          messages: [{ role: "user", content: userInput }],
        });
        props.setSelectedThreadId(response.id);
        await props.addRecentThreads({
          threadId: response.id,
          name: "New Thread",
        });

        threadId = response.id;
      } else {
        await openAiClient.beta.threads.messages.create(
          props.selectedThreadId,
          {
            role: "user",
            content: userInput,
          }
        );
        threadId = props.selectedThreadId;
      }
      const runResponse = await openAiClient.beta.threads.runs.create(
        threadId,
        {
          assistant_id: config.assistantId,
        }
      );
      const runId = runResponse.id;
      const intervalId = setInterval(async () => {
        const runStatus = await openAiClient.beta.threads.runs.retrieve(
          threadId,
          runId
        );
        if (runStatus.status === "completed") {
          clearInterval(intervalId);
          const messageResponse = await openAiClient.beta.threads.messages.list(
            threadId
          );
          props.setMessages(messageResponse.data);
          console.log(messageResponse.data);
        }
      }, 1000);

      setUserInput("");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-scroll">
        {props.messages.length === 0 ? (
          <InitialScreen />
        ) : (
          <MessageList
            messages={props.messages}
            openAiClient={props.openAiClient}
          />
        )}
      </div>
      <InputBox
        setUserInput={setUserInput}
        userInput={userInput}
        handleSendMessage={handleSendMessage}
        setSelectedThreadId={props.setSelectedThreadId}
        setMessages={props.setMessages}
      />
    </div>
  );
};

export default Chat;
