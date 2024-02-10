import { useContext } from "react";
import { ConfigContext } from "../context/ConfigContext";

const InitialScreen = () => {
  const config = useContext(ConfigContext);
  const isApiKeyProvided = config.apiKey.length > 0;
  return (
    <>
      <div className="text-center font-bold text-4xl mt-32">
        Desktop Copilot
      </div>
      <div className="text-center text-2xl mt-4">
        Your AI companion for the desktop
      </div>
      <div className="text-center mt-4">
        {isApiKeyProvided
          ? "Using OpenAI Assistants API."
          : "OpenAI API key is required."}
      </div>
    </>
  );
};

export default InitialScreen;
