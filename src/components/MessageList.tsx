import { ThreadMessage } from "openai/resources/beta/threads/index.mjs";

type Props = {
  messages: Array<ThreadMessage>;
};

const MessageList = (props: Props) => {
  const reversedMessages = props.messages.slice().reverse();
  return (
    <div
      className="mx-8 mt-12"
      style={{
        whiteSpace: "pre-line",
        overflowWrap: "break-word",
        overflowX: "hidden",
      }}
    >
      {reversedMessages.map((message, index) => {
        return (
          <div key={index} className="mb-4">
            <div className="font-bold">{message.role}</div>
            {message.content.map((content, index) => {
              if (content.type === "text") {
                return <>{content.text.value || ""}</>;
              }
            })}
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
