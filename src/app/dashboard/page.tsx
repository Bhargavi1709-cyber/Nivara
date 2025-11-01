"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, logout } from "@/lib/auth";

const Dashboard = () => {
  const router = useRouter();
  const user = typeof window !== "undefined" ? getCurrentUser() : null;

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // const handleLogout = () => {
  //   logout();
  //   router.push("/login");
  // };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <div className="min-h-screen bg-gray-50"></div>;
};

export default Dashboard;
