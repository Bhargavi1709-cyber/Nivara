"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, logout } from "@/lib/auth";
import Button from "@/components/ui/Button";

const Dashboard = () => {
  const router = useRouter();
  const user = typeof window !== "undefined" ? getCurrentUser() : null;

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">Nivara</h1>
            <p className="text-sm text-gray-600">Health Monitoring Dashboard</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Welcome back, {user?.fullName}!
          </h2>
          <p className="text-gray-600">
            Here&apos;s your health monitoring dashboard
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Account Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-start border-b pb-3">
              <span className="text-gray-600 font-medium w-40">Full Name:</span>
              <span className="text-gray-900">{user?.fullName}</span>
            </div>
            <div className="flex items-start border-b pb-3">
              <span className="text-gray-600 font-medium w-40">Email:</span>
              <span className="text-gray-900">{user?.email}</span>
            </div>
            <div className="flex items-start">
              <span className="text-gray-600 font-medium w-40">
                Member Since:
              </span>
              <span className="text-gray-900">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
            <h4 className="text-lg font-semibold mb-2">Health Score</h4>
            <p className="text-3xl font-bold">85/100</p>
            <p className="text-sm opacity-90 mt-2">Good overall health</p>
          </div>

          <div className="bg-linear-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
            <h4 className="text-lg font-semibold mb-2">Active Days</h4>
            <p className="text-3xl font-bold">24</p>
            <p className="text-sm opacity-90 mt-2">This month</p>
          </div>

          <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
            <h4 className="text-lg font-semibold mb-2">Health Goals</h4>
            <p className="text-3xl font-bold">3/5</p>
            <p className="text-sm opacity-90 mt-2">Goals completed</p>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            More Features Coming Soon
          </h3>
          <p className="text-blue-800">
            We&apos;re working on adding more health monitoring features,
            including real-time vitals tracking, AI-powered health insights, and
            personalized recommendations.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
