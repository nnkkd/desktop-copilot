import OpenAI from "openai";
import { ThreadMessage } from "openai/resources/beta/threads/index.mjs";
import { Dispatch } from "react";

type Props = {
  selectedThreadId: string | null;
  setSelectedThreadId: Dispatch<React.SetStateAction<string | null>>;
  recentActivity: Array<string>;
  setMessages: Dispatch<React.SetStateAction<Array<ThreadMessage>>>;
  openAiClient: OpenAI | null;
};

const Recent = (props: Props) => {
  const handleChangeThread = async (threadId: string) => {
    props.setSelectedThreadId(threadId);
    if (props.openAiClient) {
      const messages = await props.openAiClient.beta.threads.messages.list(
        threadId
      );
      props.setMessages(messages.data);
    }
  };
  return (
    <div className="w-64">
      <div className="font-bold text-center pb-4 border-b-primary border-b mb-8">
        最近のアクティビティ
      </div>
      {props.recentActivity.map((threadId, index) => {
        return (
          <div
            key={index}
            className="truncate text-center p-4 border-primary border cursor-pointer mx-2 my-2"
            onClick={() => handleChangeThread(threadId)}
          >
            {threadId}
          </div>
        );
      })}
    </div>
  );
};

export default Recent;
