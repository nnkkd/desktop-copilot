import { ThreadMessage } from "openai/resources/beta/threads/index.mjs";
import { Dispatch } from "react";

type Props = {
  userInput: string;
  setUserInput: Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
  setSelectedThreadId: Dispatch<React.SetStateAction<string | null>>;
  setMessages: Dispatch<React.SetStateAction<Array<ThreadMessage>>>;
};

const InputBox = (props: Props) => {
  const handleNewThread = async () => {
    props.setSelectedThreadId(null);
    props.setMessages([]);
  };
  return (
    <div className="flex items-center">
      <div className="flex items-center h-12">
        <button
          className="m-2 p-2 border border-primary h-full hover:bg-gray-100"
          onClick={handleNewThread}
        >
          new thread
        </button>
      </div>
      <div className="grow m-4 flex border border-primary items-center">
        <textarea
          className="flex-1 border-r border-gray-300"
          value={props.userInput}
          onChange={(e) => props.setUserInput(e.target.value)}
        />
        <button
          className="h-12 flex-none border border-primary px-4 ml-2 hover:bg-gray-100"
          onClick={props.handleSendMessage}
        >
          send
        </button>
      </div>
    </div>
  );
};

export default InputBox;
