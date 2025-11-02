"use client";
import { logout } from "@/lib/auth";
import {
  Leaf,
  X,
  Clock,
  Settings,
  Trash2,
  Download,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { User } from "@/lib/auth";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
}

interface HistoryItem {
  id: string;
  title: string;
  timestamp: string;
  type: "chat" | "analysis" | "report";
}

const LeftBar = ({ user }: { user: User | null }) => {
  const [activeItem, setActiveItem] = useState("home");
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [showHistoryPopup, setShowHistoryPopup] = useState(false);

  // Sample history data
  const historyItems: HistoryItem[] = [
    {
      id: "1",
      title: "Health Analysis Report",
      timestamp: "2 hours ago",
      type: "analysis",
    },
    {
      id: "2",
      title: "Nutrition Chat Session",
      timestamp: "1 day ago",
      type: "chat",
    },
    {
      id: "3",
      title: "Weekly Health Summary",
      timestamp: "3 days ago",
      type: "report",
    },
    {
      id: "4",
      title: "Exercise Consultation",
      timestamp: "1 week ago",
      type: "chat",
    },
    {
      id: "5",
      title: "Blood Test Analysis",
      timestamp: "2 weeks ago",
      type: "analysis",
    },
  ];

  const navItems: NavItem[] = [
    {
      id: "home",
      label: "Home",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
      ),
    },
    {
      id: "chat",
      label: "Chat",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
          />
        </svg>
      ),
    },
    {
      id: "history",
      label: "History",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      ),
    },
    {
      id: "settings",
      label: "Settings",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
      ),
    },
  ];

  const handleNavItemClick = (itemId: string) => {
    if (itemId === "settings") {
      setShowSettingsPopup(true);
    } else if (itemId === "history") {
      setShowHistoryPopup(true);
    } else {
      setActiveItem(itemId);
    }
  };

  const closePopup = () => {
    setShowSettingsPopup(false);
    setShowHistoryPopup(false);
  };

  const getHistoryIcon = (type: string) => {
    switch (type) {
      case "chat":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "analysis":
        return <Settings className="w-4 h-4 text-green-500" />;
      case "report":
        return <Download className="w-4 h-4 text-purple-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  };

  const handleResubmitHealthData = () => {
    if (
      confirm(
        "Are you sure you want to resubmit your health input data? This will redirect you to the health inputs page."
      )
    ) {
      // Redirect to health inputs page with resubmit parameter
      if (typeof window !== "undefined") {
        window.location.href = "/healthinputs?resubmit=true";
      }
    }
  };
  const router = useRouter();
  return (
    <aside className="h-full w-full py-3 pl-3 pr-1 max-md:hidden">
      <div className="h-full w-full flex flex-col bg-white  border border-gray-100 rounded-xl">
        {/* Header Section */}
        <div className="flex flex-col gap-6 p-6 border-b border-gray-50">
          {/* Brand */}
          <header className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 bg-sky-50 rounded-lg">
                <Leaf className="w-5 h-5 text-sky-600" />
              </div>
              <span className="text-xl font-bold text-slate-900 font-nunito">
                Nivara
              </span>
            </div>
            <div className="pl-0.5">
              <span className="text-sm font-medium text-slate-500">
                {user?.email || "user@eg.com"}
              </span>
            </div>
          </header>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-1">
            {navItems.map((item, i) => {
              const isActive = activeItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    handleNavItemClick(item.id);
                    if (i === 1) {
                      router.push("/dashboard/chatbot");
                    }
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                    text-sm font-medium transition-all duration-200 ease-out
                    group relative overflow-hidden
                    ${
                      isActive
                        ? "bg-sky-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-sky-50 hover:text-sky-700 active:scale-95"
                    }
                  `}
                >
                  <div
                    className={`
                      flex items-center justify-center w-5 h-5 transition-transform duration-200
                      ${isActive ? "" : "group-hover:scale-110"}
                    `}
                  >
                    {item.icon}
                  </div>
                  <span className="font-nunito tracking-wide">
                    {item.label}
                  </span>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full opacity-80" />
                  )}

                  {/* Hover effect background */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-linear-to-r from-sky-50/0 via-sky-50/50 to-sky-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer Section */}
        <footer className="px-6 py-4 border-t border-gray-50">
          <div className="text-xs font-medium text-slate-400 text-center">
            <span className="block">© 2024 Nivara</span>
            <span className="text-slate-300">All rights reserved</span>
          </div>
        </footer>
      </div>

      {/* Settings Popup */}
      {showSettingsPopup && (
        <div
          className="fixed inset-0 bg-black/10 flex items-center justify-center z-50"
          onClick={closePopup}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-[500px] max-h-[600px] overflow-hidden animate-in fade-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-sky-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 font-nunito">
                  Settings
                </h2>
              </div>
              <button
                onClick={closePopup}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Profile Settings */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800">
                  Profile Settings
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={user?.fullName || ""}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800">Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Dark Mode</span>
                    <button className="w-12 h-6 bg-gray-200 rounded-full relative transition-colors">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Notifications
                    </span>
                    <button className="w-12 h-6 bg-sky-500 rounded-full relative transition-colors">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Auto-save Chat History
                    </span>
                    <button className="w-12 h-6 bg-sky-500 rounded-full relative transition-colors">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800">Account</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleResubmitHealthData}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sky-600 hover:bg-sky-50 rounded-lg transition-colors group"
                  >
                    <RefreshCw className="w-5 h-5 text-sky-500 group-hover:text-sky-600" />
                    <span className="font-medium">
                      Resubmit Health Input Data
                    </span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
                  >
                    <LogOut className="w-5 h-5 text-red-500 group-hover:text-red-600" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={closePopup}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-slate-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={closePopup}
                  className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Popup */}
      {showHistoryPopup && (
        <div
          className="fixed inset-0 bg-black/10 flex items-center justify-center z-50"
          onClick={closePopup}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-[500px] max-h-[600px] overflow-hidden animate-in fade-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-sky-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 font-nunito">
                  History
                </h2>
              </div>
              <button
                onClick={closePopup}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Search */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search history..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>

              {/* History List */}
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {historyItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer group"
                  >
                    <div className="shrink-0">{getHistoryIcon(item.type)}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-slate-800 truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500">{item.timestamp}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200">
                        <Download className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200">
                        <Trash2 className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 mt-4 border-t border-gray-100">
                <button
                  onClick={closePopup}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-slate-600 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors">
                  Export All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default LeftBar;
