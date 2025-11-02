"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type ValueType = string;
interface chatDataType {
  role: "user" | "assistant";
  content: ValueType;
  timestamp?: string;
}

interface ChatHistoryType {
  id: string;
  timeStamp: string;
  title: string;
  data: chatDataType[];
}

interface AIContextType {
  chatHistory: ChatHistoryType[];
  addToChatHistory: () => void;
  currentChatData: chatDataType[];
  addCurrentChatData: (message: chatDataType) => void;
  getAnswer: (prompt: string) => void;
  loadChatHistory: () => void;
  clearCurrentChat: () => void;
  loadChatById: (id: string) => void;
  deleteChatById: (id: string) => void;
  getCurrentChatId: () => string | null;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

// Local storage keys
const CHAT_HISTORY_KEY = "nivara_chat_history";
const CURRENT_CHAT_KEY = "nivara_current_chat";

export const AIProvider = ({ children }: { children: ReactNode }) => {
  const [chatHistory, setChatHistory] = useState<ChatHistoryType[]>([]);
  const [currentChatData, setCurrentChatData] = useState<chatDataType[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  // Load chat history from localStorage on component mount
  useEffect(() => {
    loadChatHistory();
    loadCurrentChat();
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  // Save current chat data whenever it changes
  useEffect(() => {
    if (currentChatData.length > 0 && currentChatId) {
      const currentChat = {
        id: currentChatId,
        data: currentChatData,
      };
      localStorage.setItem(CURRENT_CHAT_KEY, JSON.stringify(currentChat));
    }
  }, [currentChatData, currentChatId]);

  const loadChatHistory = () => {
    try {
      const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
      if (savedHistory) {
        const parsedHistory: ChatHistoryType[] = JSON.parse(savedHistory);
        setChatHistory(parsedHistory);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const loadCurrentChat = () => {
    try {
      const savedCurrentChat = localStorage.getItem(CURRENT_CHAT_KEY);
      if (savedCurrentChat) {
        const parsedChat = JSON.parse(savedCurrentChat);
        setCurrentChatData(parsedChat.data || []);
        setCurrentChatId(parsedChat.id || null);
      }
    } catch (error) {
      console.error("Error loading current chat:", error);
    }
  };

  const generateChatId = () => {
    return `chat_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  };

  const generateTitle = (firstMessage: string) => {
    return firstMessage.length > 50
      ? firstMessage.substring(0, 47) + "..."
      : firstMessage;
  };

  const addToChatHistory = () => {
    if (currentChatData.length === 0 || !currentChatId) return;

    const firstUserMessage = currentChatData.find((msg) => msg.role === "user");
    const title = firstUserMessage
      ? generateTitle(firstUserMessage.content)
      : "New Chat";

    const newEntry: ChatHistoryType = {
      id: currentChatId,
      timeStamp: new Date().toISOString(),
      title,
      data: [...currentChatData],
    };

    setChatHistory((prev) => {
      // Check if chat already exists, update it
      const existingIndex = prev.findIndex((chat) => chat.id === currentChatId);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = newEntry;
        return updated;
      }
      // Add new chat to the beginning of the array
      return [newEntry, ...prev];
    });
  };

  const addCurrentChatData = (message: chatDataType) => {
    const messageWithTimestamp: chatDataType = {
      ...message,
      timestamp: new Date().toISOString(),
    };

    setCurrentChatData((prev) => {
      const updated = [...prev, messageWithTimestamp];

      // If this is the first message, create a new chat ID
      if (prev.length === 0) {
        const newChatId = generateChatId();
        setCurrentChatId(newChatId);
      }

      return updated;
    });
  };

  const getAnswer = async (prompt: string) => {
    const url = "/api/ai";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch AI response");
      }

      const data = await response.json();
      const aiResponse =
        data.data || data.res || "Sorry, I couldn't process your request.";

      addCurrentChatData({ role: "assistant", content: aiResponse });

      // Auto-save to history after AI response
      setTimeout(() => {
        addToChatHistory();
      }, 100);

      return aiResponse;
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage =
        "Sorry, I'm having trouble processing your request right now.";
      addCurrentChatData({ role: "assistant", content: errorMessage });
      return errorMessage;
    }
  };

  const clearCurrentChat = () => {
    setCurrentChatData([]);
    setCurrentChatId(null);
    localStorage.removeItem(CURRENT_CHAT_KEY);
  };

  const loadChatById = (id: string) => {
    const chat = chatHistory.find((c) => c.id === id);
    if (chat) {
      setCurrentChatData([...chat.data]);
      setCurrentChatId(id);
    }
  };

  const deleteChatById = (id: string) => {
    setChatHistory((prev) => prev.filter((chat) => chat.id !== id));

    // If we're deleting the current chat, clear it
    if (currentChatId === id) {
      clearCurrentChat();
    }

    // Update localStorage
    const updatedHistory = chatHistory.filter((chat) => chat.id !== id);
    if (updatedHistory.length > 0) {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(updatedHistory));
    } else {
      localStorage.removeItem(CHAT_HISTORY_KEY);
    }
  };

  const getCurrentChatId = () => {
    return currentChatId;
  };

  return (
    <AIContext.Provider
      value={{
        chatHistory,
        addToChatHistory,
        currentChatData,
        addCurrentChatData,
        getAnswer,
        loadChatHistory,
        clearCurrentChat,
        loadChatById,
        deleteChatById,
        getCurrentChatId,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) throw new Error("useAI must be used within AIProvider");
  return context;
};
