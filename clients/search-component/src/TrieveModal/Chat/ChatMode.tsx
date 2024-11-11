import React, { Suspense } from "react";
import { BackIcon } from "../icons";
import { useModalState } from "../../utils/hooks/modal-context";
import { AIInitialMessage } from "./AIInitalMessage";
import { useChatState } from "../../utils/hooks/chat-context";
import { ChatMessage } from "./ChatMessage";

export const ChatMode = () => {
  const { props, setMode, modalRef, open, setOpen, mode } = useModalState();
  const {
    askQuestion,
    messages,
    currentQuestion,
    setCurrentQuestion,
    clearConversation,
    isDoneReading,
    stopGeneratingMessage,
  } = useChatState();

  const chatInput = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (mode == "chat" && open) {
      chatInput.current?.focus();
    }
  }, [chatInput, mode, open]);

  return (
    <Suspense>
      <div className="chat-outer-wrapper" ref={modalRef}>
        <div
          className={`close-modal-button ${props.type}`}
          onClick={() => setOpen(false)}
        >
          <svg
            className="close-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          <span>Close</span>
        </div>
        <div className="system-information-wrapper">
          <div className="ai-message">
            <div className="chat-modal-wrapper">
              <div className="ai-message initial-message">
                <AIInitialMessage />
                {messages.map((chat, i) => (
                  <div key={i} className="message-wrapper">
                    {chat.map((message, idx) => (
                      <ChatMessage key={idx} idx={idx} message={message} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="chat-footer-wrapper">
        <div className="input-wrapper chat">
          <button onClick={() => setMode("search")} className="back-icon">
            <BackIcon />
          </button>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (currentQuestion) {
                askQuestion(currentQuestion);
              }
            }}
          >
            <input
              ref={chatInput}
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              placeholder="Ask me anything"
            />
          </form>
        </div>
        <div className={`trieve-footer chat ${props.type}`}>
          <div className="bottom-row">
            {messages.length ? (
              <button
                onClick={() =>
                  isDoneReading?.current
                    ? clearConversation()
                    : stopGeneratingMessage()
                }
                className="clear-button"
              >
                {isDoneReading?.current ? "Clear messages" : "Stop Generating"}
              </button>
            ) : null}
            <span className="spacer" />
            <a
              className="trieve-powered"
              href="https://trieve.ai"
              target="_blank"
            >
              <img src="https://cdn.trieve.ai/trieve-logo.png" alt="logo" />
              Powered by Trieve
            </a>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default ChatMode;
