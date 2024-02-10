import OpenAI from "openai";
import { ThreadMessage } from "openai/resources/beta/threads/index.mjs";
import { useEffect, useState } from "react";

type Props = {
  messages: Array<ThreadMessage>;
  openAiClient: OpenAI | null;
};

const MessageList = (props: Props) => {
  const [images, setImages] = useState<{ [key: string]: string }>({});
  const [isImageFetching, setIsImageFetching] = useState<boolean>(false);

  useEffect(() => {
    const fetchImageFiles = async () => {
      if (!props.openAiClient) return;
      setIsImageFetching(true);
      const newImages = { ...images };
      let isUpdated = false;

      for (const message of props.messages) {
        for (const content of message.content) {
          if (
            content.type === "image_file" &&
            !(content.image_file.file_id in newImages)
          ) {
            const file = await props.openAiClient.files.content(
              content.image_file.file_id
            );
            const blob = await file.blob();
            const url = URL.createObjectURL(blob);
            newImages[content.image_file.file_id] = url;
            isUpdated = true;
          }
        }
      }

      if (isUpdated) {
        setImages(newImages);
      }
      setIsImageFetching(false);
    };

    fetchImageFiles();
  }, [props.messages, props.openAiClient]);
  const reversedMessages = props.messages.slice().reverse();

  return !isImageFetching ? (
    <div className="mx-8 mt-12">
      {reversedMessages.map((message, index) => (
        <div key={index} className="mb-4">
          <div className="font-bold">{message.role}</div>
          {message.content.map((content, contentIndex) => {
            if (content.type === "text") {
              return (
                <div key={contentIndex} className="whitespace-pre-wrap">
                  {content.text.value || ""}
                </div>
              );
            } else if (content.type === "image_file") {
              const imageUrl = images[content.image_file.file_id];
              return imageUrl ? (
                <img key={contentIndex} src={imageUrl} alt="" />
              ) : null;
            }
          })}
        </div>
      ))}
    </div>
  ) : null;
};
export default MessageList;
