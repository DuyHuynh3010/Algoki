import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Send2 } from "iconsax-react";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import { useSendMessageChatbot } from "@/hooks/queries/chatbot/useChatbot";
import _ from "lodash";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css";
// Drop-in component

const remarkPlugins = [remarkMath, remarkGfm];
const rehypePlugins = [[rehypeKatex, { strict: false }]] as any;
// Usage: <AIHelperModal /> anywhere in your app
export default function AIHelperModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [value, setValue] = React.useState("");
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const { createChat, sendMessageToChat } = useSendMessageChatbot();
  const [listMessage, setListMessage] = useState<any>([]);
  const chatId = useRef<number>(null);
  const user_id = "u-123";
  const handleCreateChat = () => {
    createChat.mutate(
      { title: "New title", forceCreate: true },
      {
        onSuccess: (res) => {
          console.log("12312", res);
          chatId.current = res.id;
        },
        onError: () => {
          console.log("ERRORRR");
        },
      },
    );
  };

  useEffect(() => {
    handleCreateChat();
  }, []);

  function handleAsk(q?: string) {
    const text = q ?? value;
    if (!text.trim()) return;
    setListMessage((prev: any) => {
      return [
        ...prev,
        {
          message: text,
          isMe: true,
        },
      ];
    });
    sendMessageToChat.mutate(
      {
        chatId: chatId.current as number,
        message_text: value,
        user_id,
      },
      {
        onSuccess: (res) => {
          const content = JSON.parse(res.content);
          setListMessage((prev: any) => {
            return [
              ...prev,
              {
                message: content.data,
                isMe: false,
              },
            ];
          });
          if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop =
              messageContainerRef.current.scrollHeight;
          }
        },
      },
    );
    setValue("");
  }

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [listMessage]);

  const renderMessage = (message: any) => {
    if (_.isString(message)) {
      return message;
    }
    const valueMessage: any = {};
    try {
      const data = JSON.parse(message.answer);
      console.log("JSON.parse data", data);
      valueMessage["answer"] = data?.answer;
    } catch (error) {
      console.log("error--", error);
      valueMessage["answer"] = message?.answer;
    }
    return (
      <>
        <ReactMarkdown
          remarkPlugins={remarkPlugins}
          rehypePlugins={rehypePlugins}
        >
          {valueMessage?.answer}
        </ReactMarkdown>
        {message?.solution && (
          <ReactMarkdown
            remarkPlugins={remarkPlugins}
            rehypePlugins={rehypePlugins}
          >
            {message?.solution}
          </ReactMarkdown>
        )}
        {message?.suggestion && (
          <ReactMarkdown
            remarkPlugins={remarkPlugins}
            rehypePlugins={rehypePlugins}
          >
            {message?.suggestion}
          </ReactMarkdown>
        )}
      </>
    );
  };

  const renderSpinner = () => {
    return (
      <div className="flex justify-center items-center bg-white dark:bg-[#212B36]">
        <div className="w-9 h-9 border-4 border-t-4 border-[#b5a9a9] dark:border-gray-600 border-t-primary-main dark:border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 gap-0  rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <DialogTitle className="text-base text-left py-6 border-b-[1px] border-[#919EAB3D]">
              AI Assistant
            </DialogTitle>
            <DialogDescription className="mt-4 hidden lg:block">
              <div className="text-left font-bold">
                Have any questions about this course?
              </div>
              <div className="text-left text-sm text-primary-main">
                Our AI assistant is here to guide you.
              </div>
            </DialogDescription>
          </div>
        </div>

        {/*<Separator />*/}

        {/* Suggested questions */}
        <div
          ref={messageContainerRef}
          className="px-5 py-4 space-y-3 h-[30vh] lg:h-[60vh] overflow-y-auto"
        >
          <DialogDescription className="mt-4 block lg:hidden">
            <div className="text-left font-bold">
              Have any questions about this course?
            </div>
            <div className="text-left text-sm text-primary-main">
              Our AI assistant is here to guide you.
            </div>
          </DialogDescription>
          {listMessage.map((item: any, index: number) => (
            <div key={index}>
              <div
                key={index}
                className={`${
                  item.isMe ? "justify-end" : "justify-start"
                } flex`}
              >
                <div
                  className={`${
                    item.isMe
                      ? "bg-primary-main text-[#FFFFFF]"
                      : "bg-[#F3F4F6] text-black"
                  } max-w-[70%] p-3 rounded-xl whitespace-pre-wrap break-words`}
                >
                  {renderMessage(item.message)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer input */}
        <div className="px-5 pb-5 pt-2">
          <div className="relative">
            <Textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Ask a question"
              className="h-[100px] rounded-xl pr-16 resize-none flex items-start"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  // e.preventDefault();
                  handleAsk();
                }
              }}
            />
            <Button
              type="button"
              size="icon"
              className="absolute right-4 bottom-4 h-9 w-9 rounded-xl "
              onClick={() => handleAsk()}
            >
              {sendMessageToChat.isPending ? (
                renderSpinner()
              ) : (
                <Send2 color="white" size={20} />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
