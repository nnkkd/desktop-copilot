import OpenAI from "openai";
import { ThreadMessage } from "openai/resources/beta/threads/index.mjs";
import { useEffect, useState } from "react";
import { save } from "@tauri-apps/api/dialog";
import { fs } from "@tauri-apps/api";

type Props = {
  messages: Array<ThreadMessage>;
  openAiClient: OpenAI | null;
};

type ImageContentMap = {
  [key: string]: {
    url: string;
    blob: Blob;
    id: string;
  };
};

const MessageList = (props: Props) => {
  const [images, setImages] = useState<ImageContentMap>({});
  const [isImageFetching, setIsImageFetching] = useState<boolean>(false);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    blob: Blob | null;
  }>({ x: 0, y: 0, blob: null });

  const handleContextMenu = (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>,
    blob: Blob
  ) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      blob,
    });
  };

  const handleClick = () => {
    setContextMenu({ ...contextMenu, blob: null });
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleSaveImage = async (blob: Blob) => {
    const path = await save({
      defaultPath: "image.png",
    });
    if (path) {
      fs.writeBinaryFile(path, new Uint8Array(await blob.arrayBuffer())).then(
        () => {
          console.log("File saved");
        }
      );
    }
  };

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
            newImages[content.image_file.file_id] = {
              id: content.image_file.file_id,
              url,
              blob,
            };
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
              const image = images[content.image_file.file_id];
              return image ? (
                <img
                  width={400}
                  height={400}
                  className="object-contain h-2/5"
                  key={contentIndex}
                  src={image.url}
                  alt=""
                  onContextMenu={(e) => handleContextMenu(e, image.blob)}
                />
              ) : null;
            }
          })}
        </div>
      ))}
      {contextMenu.blob && (
        <ul
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="absolute bg-white border border-gray-200 shadow-lg"
        >
          <li
            className="cursor-pointer hover:bg-gray-100 p-2"
            onClick={() =>
              contextMenu.blob && handleSaveImage(contextMenu.blob)
            }
          >
            Save Image
          </li>
        </ul>
      )}
    </div>
  ) : null;
};
export default MessageList;
