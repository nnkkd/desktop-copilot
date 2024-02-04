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
  setRecentActivity: (
    callbackFn: (activities: Array<string>) => Array<string>
  ) => void;
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
        // Create a new thread
        const response = await openAiClient.beta.threads.create({
          messages: [{ role: "user", content: userInput }],
        });
        props.setSelectedThreadId(response.id);
        props.setRecentActivity((prev) => {
          return [response.id, ...prev];
        });
        threadId = response.id;
      } else {
        // Add a message to the existing thread
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
    <div className="relative min-h-screen overflow-hidden">
      {props.messages.length === 0 ? (
        <InitialScreen />
      ) : (
        <MessageList messages={props.messages} />
      )}{" "}
      <div className="absolute bottom-0 w-full">
        <InputBox
          serUserInput={setUserInput}
          userInput={userInput}
          handleSendMessage={handleSendMessage}
          setSelectedThreadId={props.setSelectedThreadId}
          setMessages={props.setMessages}
        />
      </div>
    </div>
  );
};

export default Chat;
