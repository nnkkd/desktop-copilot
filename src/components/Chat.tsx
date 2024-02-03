import { useState } from "react";
import InitialScreen from "./InitialScreen";
import InputBox from "./InputBox";

const Chat = () => {
  const [messages, setMessages] = useState<Array<any>>([]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {messages.length === 0 ? <InitialScreen /> : null}{" "}
      <div className="absolute bottom-0 w-full">
        <InputBox />
      </div>
    </div>
  );
};

export default Chat;
