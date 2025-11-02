"use client";
import { AIProvider, useAI } from "@/hooks/useAI";
import { Leaf } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const App = () => {
  const [isSidebar, setIsSidebar] = useState<boolean>(!false);
  const ref = useRef<HTMLDivElement | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);
  const {
    currentChatData,
    getAnswer,
    addCurrentChatData,
    chatHistory,
    loadChatById,
    clearCurrentChat,
    getCurrentChatId,
    addToChatHistory,
  } = useAI();
  const [loading, setLoading] = useState(false);

  const handleGet = async () => {
    if (prompt.trim() === "") return;
    setLoading(true);

    // Add user message
    addCurrentChatData({ role: "user", content: prompt });

    // Get AI response
    await getAnswer(prompt);

    // Auto-save to history after a short delay to ensure AI response is included
    setTimeout(() => {
      addToChatHistory();
    }, 500);

    setPrompt("");
    setLoading(false);
  };

  const handleChatClick = (chatId: string) => {
    // Save current chat to history before switching if it has messages
    if (currentChatData.length > 0 && getCurrentChatId()) {
      addToChatHistory();
    }

    // Load the selected chat and move it to the top (most recent)
    loadChatById(chatId);

    // Close sidebar on mobile after selecting chat
    if (window.innerWidth < 768) {
      setIsSidebar(false);
    }
  };

  const handleNewChat = () => {
    // Save current chat to history before starting new one if it has messages
    if (currentChatData.length > 0 && getCurrentChatId()) {
      addToChatHistory();
    }

    clearCurrentChat();
    setPrompt("");
    if (window.innerWidth < 768) {
      setIsSidebar(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffTime = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
      } else if (diffDays === 1) {
        return "Yesterday";
      } else if (diffDays < 7) {
        return `${diffDays} days ago`;
      } else {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="h-screen w-full flex font-family-poppins *:transition-all *:ease-in-out *:duration-200">
      <aside
        className={`h-screen ${isSidebar ? "w-80 max-md:absolute z-10 bg-white" : "w-16 "}  grid-cols-1 grid grid-rows-[auto_3rem] border-r border-gray-200  p-2 `}
      >
        <div className="grid grid-cols-1 grid-rows-[4rem_3rem_auto] h-full overflow-hidden">
          <header className="flex items-center ml-2 h-12 gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 bg-sky-50 rounded-lg">
              <Leaf className="w-5 h-5 text-sky-600" />
            </div>
            {isSidebar && (
              <span className="text-xl font-bold text-slate-900 font-nunito">
                Nivara
              </span>
            )}
          </header>
          <div className="flex items-center justify-between ml-3 h-12 gap-2.5 text-black/60 border-t border-gray-500">
            <div className="flex items-center gap-2.5">
              <span className="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </span>
              {isSidebar && (
                <span className="text-sm font-medium pt-0.5 font-nunito">
                  History
                </span>
              )}
            </div>
            {
              <button
                onClick={handleNewChat}
                className="p-1.5 rounded-md hover:bg-black/10 transition-colors mr-2"
                title="New Chat"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </button>
            }
          </div>
          {isSidebar && (
            <section className="h-full w-full overflow-hidden">
              <div className="h-full w-full ml-2 overflow-y-scroll">
                {chatHistory.length > 0 ? (
                  (() => {
                    // Sort chats by timestamp (latest first)
                    const sortedChats = [...chatHistory].sort(
                      (a, b) =>
                        new Date(b.timeStamp).getTime() -
                        new Date(a.timeStamp).getTime()
                    );

                    // Group chats by date
                    const groupedChats = sortedChats.reduce(
                      (groups: { [key: string]: typeof sortedChats }, chat) => {
                        const chatDate = new Date(chat.timeStamp);
                        const today = new Date();
                        const yesterday = new Date(today);
                        yesterday.setDate(yesterday.getDate() - 1);

                        let dateKey = "";
                        if (chatDate.toDateString() === today.toDateString()) {
                          dateKey = "Today";
                        } else if (
                          chatDate.toDateString() === yesterday.toDateString()
                        ) {
                          dateKey = "Yesterday";
                        } else if (
                          chatDate.getTime() >
                          today.getTime() - 7 * 24 * 60 * 60 * 1000
                        ) {
                          dateKey = "This Week";
                        } else if (
                          chatDate.getTime() >
                          today.getTime() - 30 * 24 * 60 * 60 * 1000
                        ) {
                          dateKey = "This Month";
                        } else {
                          dateKey = chatDate.toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          });
                        }

                        if (!groups[dateKey]) {
                          groups[dateKey] = [];
                        }
                        groups[dateKey].push(chat);
                        return groups;
                      },
                      {}
                    );

                    return Object.entries(groupedChats).map(
                      ([dateGroup, chats]) => (
                        <div key={dateGroup} className="mb-3">
                          <div className="px-2 py-1 mb-2">
                            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              {dateGroup}
                            </h3>
                          </div>
                          {chats.map((chat) => {
                            const isActive = getCurrentChatId() === chat.id;
                            return (
                              <div
                                key={chat.id}
                                onClick={() => handleChatClick(chat.id)}
                                className={`px-2 py-2 rounded-md hover:bg-black/5 cursor-pointer mb-1 transition-colors ${
                                  isActive
                                    ? "bg-sky-100 border-l-2 border-sky-500"
                                    : ""
                                }`}
                              >
                                <h1
                                  className={`text-sm ${isActive ? "text-sky-700 font-medium" : "text-gray-900"} truncate`}
                                >
                                  {chat.title}
                                </h1>
                                <p className="text-xs text-gray-500">
                                  {formatTimestamp(chat.timeStamp)}
                                </p>
                                {isActive && (
                                  <div className="text-xs text-sky-600 mt-1 flex items-center gap-1">
                                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
                                    Active
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )
                    );
                  })()
                ) : (
                  <div className="px-2 py-4 text-center">
                    <p className="text-xs text-gray-400">No chat history yet</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Start a conversation!
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
        <footer className={`flex items-center flex-wrap ml-2 mb-4 `}>
          <button
            onClick={() => {
              setIsSidebar(!isSidebar);
            }}
            className={`p-2 rounded-full cursor-pointer hover:bg-black/10 transform  transition ease-in-out ${isSidebar ? " rotate-180" : "rotate-0"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </footer>
      </aside>
      <main className="h-full p-4 w-full  bg-white flex items-center justify-center overflow-hidden">
        <div className="mx-auto max-w-2xl   h-full w-full overflow-hidden flex flex-col items-center justify-center">
          <div className="h-[calc(100%-4rem)] overflow-y-scroll w-full ">
            {currentChatData.length >= 0 ? (
              <div className="min-h-full  rounded-md flex flex-col justify-end-safe items-start text-base">
                {currentChatData.map((message, index) => {
                  return (
                    <div
                      key={index}
                      ref={index === currentChatData.length - 1 ? ref : null}
                      id={index.toString()}
                      className={`  ${index % 2 === 0 ? "self-end  text-sky-900 max-w-[70%] bg-sky-100 rounded-l-full rounded-br-full px-6" : "self-start text-black/70 rounded-lg max-w-[90%]"}  m-3 p-3   ${Array(10).length - 1 === index ? "scroll-snap-type-y-mandatory " : ""}`}
                    >
                      <p className="">{message.content}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center justify-center h-full">
                  <Leaf className="h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    No messages yet. Ask a question to get started!
                  </p>
                </div>
              </>
            )}
            {loading && (
              <div className="animate-pulse max-w-[70%] self-start text-black font-medium rounded-lg m-3 p-3">
                <p>Thinking...</p>
              </div>
            )}
          </div>
          <div className="h-14 w-full bg-black/2 border border-gray-300 rounded-full gap-3 pl-5 pr-2 py-2 flex items-center justify-between">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !loading) {
                  handleGet();
                }
              }}
              placeholder="Ask your doubt"
              className="w-full h-full outline-0"
              disabled={loading}
            />
            <button
              onClick={handleGet}
              className="p-2 rounded-full bg-black text-white cursor-pointer transition duration-150 ease-in-out active:scale-95 hover:bg-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-5 "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
                />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

const ChatBot = () => {
  return (
    <AIProvider>
      <App />
    </AIProvider>
  );
};

export default ChatBot;
