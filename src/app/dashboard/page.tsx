"use client";
import LeftBar from "@/components/(dashboard)/LeftBar";
import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/auth";
import {
  getTodayHealthRecord,
  getHealthRecords,
  hasSubmittedToday,
  needsHealthSubmission,
  getTimeUntilNextSubmission,
} from "@/lib/healthData";
import {
  Heart,
  Activity,
  Moon,
  Flame,
  Weight,
  Brain,
  AlertCircle,
  TrendingUp,
  Clock,
  CheckCircle,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import HealthChart from "@/components/(dashboard)/HealthChart";
import { HealthRecord } from "@/lib/healthData";
import { User } from "@/lib/auth";

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [todayRecord, setTodayRecord] = useState<HealthRecord | null>(null);
  const [recentRecords, setRecentRecords] = useState<HealthRecord[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [needsSubmission, setNeedsSubmission] = useState(false);
  const [timeUntilNext, setTimeUntilNext] = useState({ hours: 0, minutes: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        router.push("/login");
        return;
      }

      // Load health data
      const today = getTodayHealthRecord(currentUser.id);
      const allRecords = getHealthRecords(currentUser.id);
      const submitted = hasSubmittedToday(currentUser.id);
      const needs = needsHealthSubmission(currentUser.id);
      const timeNext = getTimeUntilNextSubmission();

      // Batch all state updates
      setUser(currentUser);
      setTodayRecord(today);
      setRecentRecords(allRecords.slice(-7).reverse()); // Last 7 records
      setHasSubmitted(submitted);
      setNeedsSubmission(needs);
      setTimeUntilNext(timeNext);
      setIsLoading(false);
    };

    loadDashboardData();
  }, [router]);
  const getSymptomsList = (record: HealthRecord) => {
    const symptoms = [];
    if (record.headache) symptoms.push("Headache");
    if (record.fatigue) symptoms.push("Fatigue");
    if (record.lossOfAppetite) symptoms.push("Loss of Appetite");
    if (record.bodyPain) symptoms.push("Body Pain");
    if (record.dizziness) symptoms.push("Dizziness");
    return symptoms;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-[280px_auto] h-screen w-full bg-gray-100">
        <LeftBar user={user} />
        <section className="h-full w-full md:py-3 md:px-1 md:pr-3">
          <main className="h-full w-full rounded-lg bg-white p-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
          </main>
        </section>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-[280px_auto] h-screen w-full bg-gray-100">
      <LeftBar user={user} />
      <section className="h-full w-full md:py-3 md:px-1 md:pr-3 overflow-hidden">
        <main className="h-full w-full rounded-lg bg-white overflow-y-auto pb-1">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.fullName || "User"}!
              </h1>
              <p className="text-gray-600">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* Health Status Banner */}
            <div className="mb-8">
              {needsSubmission ? (
                <div className="bg-linear-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-orange-900">
                          Health Input Required
                        </h3>
                        <p className="text-orange-700">
                          Please submit your daily health metrics to continue
                          tracking.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push("/healthinputs")}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Submit Now
                    </button>
                  </div>
                </div>
              ) : hasSubmitted ? (
                <div className="bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-green-900">
                          Today&apos;s Data Submitted
                        </h3>
                        <p className="text-green-700">
                          Great job! Your health data for today has been
                          recorded.
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-green-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Next: {timeUntilNext.hours}h {timeUntilNext.minutes}m
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Today's Health Overview */}
            {todayRecord && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Today&apos;s Health Snapshot
                </h2>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  {/* Heart Rate */}
                  <div className="bg-linear-to-br from-red-50 to-pink-50 border border-red-100 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Heart className="w-8 h-8 text-red-500" />
                      <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">
                        VITAL
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-red-600 mb-1">
                      Heart Rate
                    </h3>
                    <p className="text-2xl font-bold text-red-900">
                      {todayRecord.heartRate}
                    </p>
                    <p className="text-xs text-red-600">bpm</p>
                  </div>

                  {/* Blood Pressure */}
                  <div className="bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Activity className="w-8 h-8 text-blue-500" />
                      <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        BP
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-blue-600 mb-1">
                      Blood Pressure
                    </h3>
                    <p className="text-2xl font-bold text-blue-900">
                      {todayRecord.systolicBP}/{todayRecord.diastolicBP}
                    </p>
                    <p className="text-xs text-blue-600">mmHg</p>
                  </div>

                  {/* Steps */}
                  <div className="bg-linear-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <TrendingUp className="w-8 h-8 text-green-500" />
                      <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        ACTIVITY
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-green-600 mb-1">
                      Steps
                    </h3>
                    <p className="text-2xl font-bold text-green-900">
                      {parseInt(todayRecord.steps).toLocaleString()}
                    </p>
                    <p className="text-xs text-green-600">today</p>
                  </div>

                  {/* Weight */}
                  <div className="bg-linear-to-br from-purple-50 to-violet-50 border border-purple-100 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Weight className="w-8 h-8 text-purple-500" />
                      <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                        WEIGHT
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-purple-600 mb-1">
                      Weight
                    </h3>
                    <p className="text-2xl font-bold text-purple-900">
                      {todayRecord.weight}
                    </p>
                    <p className="text-xs text-purple-600">kg</p>
                  </div>
                </div>

                {/* Detailed Health Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Sleep & Recovery */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Moon className="w-5 h-5 text-indigo-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Sleep & Recovery
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Duration</span>
                        <span className="font-semibold text-gray-900">
                          {todayRecord.sleepDuration}h
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Quality Score
                        </span>
                        <span className="font-semibold text-gray-900">
                          {todayRecord.sleepQuality}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${todayRecord.sleepQuality}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Nutrition & Calories */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Flame className="w-5 h-5 text-orange-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Nutrition & Energy
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Calories Burned
                        </span>
                        <span className="font-semibold text-gray-900">
                          {parseInt(
                            todayRecord.caloriesBurned
                          ).toLocaleString()}{" "}
                          kcal
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Calories Consumed
                        </span>
                        <span className="font-semibold text-gray-900">
                          {parseInt(
                            todayRecord.caloriesConsumed
                          ).toLocaleString()}{" "}
                          kcal
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Water Intake
                        </span>
                        <span className="font-semibold text-gray-900">
                          {todayRecord.waterIntake}L
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Net Calories
                        </span>
                        <span
                          className={`font-semibold ${
                            parseInt(todayRecord.caloriesBurned) >
                            parseInt(todayRecord.caloriesConsumed)
                              ? "text-green-600"
                              : "text-orange-600"
                          }`}
                        >
                          {Math.abs(
                            parseInt(todayRecord.caloriesBurned) -
                              parseInt(todayRecord.caloriesConsumed)
                          )}{" "}
                          kcal
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mental Health */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                        <Brain className="w-5 h-5 text-teal-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Mental Wellness
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Mood Level
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {todayRecord.moodLevel}/10
                          </span>
                          <div className="flex">
                            {Array.from(
                              { length: parseInt(todayRecord.moodLevel) },
                              (_, i) => (
                                <span key={i} className="text-yellow-400">
                                  ★
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Stress Level
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {todayRecord.stressLevel}/10
                          </span>
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              parseInt(todayRecord.stressLevel) <= 3
                                ? "bg-green-100 text-green-800"
                                : parseInt(todayRecord.stressLevel) <= 6
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {parseInt(todayRecord.stressLevel) <= 3
                              ? "Low"
                              : parseInt(todayRecord.stressLevel) <= 6
                                ? "Moderate"
                                : "High"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Symptoms */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Symptoms
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {getSymptomsList(todayRecord).length > 0 ? (
                        getSymptomsList(todayRecord).map((symptom, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="text-sm text-gray-700">
                              {symptom}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">No symptoms reported</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Weekly Health Summary */}
            {recentRecords.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Weekly Summary
                </h2>
                <div className="bg-linear-to-r from-indigo-50 via-blue-50 to-cyan-50 border border-indigo-200 rounded-xl p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-900">
                        {recentRecords.length}
                      </div>
                      <div className="text-sm text-indigo-600">
                        Days Tracked
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-900">
                        {Math.round(
                          recentRecords.reduce(
                            (sum, record) => sum + parseInt(record.steps),
                            0
                          ) / recentRecords.length
                        ).toLocaleString()}
                      </div>
                      <div className="text-sm text-blue-600">
                        Avg Daily Steps
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-900">
                        {(
                          recentRecords.reduce(
                            (sum, record) =>
                              sum + parseFloat(record.sleepDuration),
                            0
                          ) / recentRecords.length
                        ).toFixed(1)}
                        h
                      </div>
                      <div className="text-sm text-cyan-600">Avg Sleep</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-900">
                        {(
                          recentRecords.reduce(
                            (sum, record) => sum + parseInt(record.moodLevel),
                            0
                          ) / recentRecords.length
                        ).toFixed(1)}
                        /10
                      </div>
                      <div className="text-sm text-purple-600">Avg Mood</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Health Trends Charts */}
            {recentRecords.length > 1 && (
              <div className="mb-8 health-trends">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Health Trends
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  <HealthChart
                    records={recentRecords}
                    metric="heartRate"
                    title="Heart Rate Trend"
                    color="#ef4444"
                    unit="bpm"
                  />
                  <HealthChart
                    records={recentRecords}
                    metric="steps"
                    title="Daily Steps"
                    color="#22c55e"
                    unit="steps"
                  />
                  <HealthChart
                    records={recentRecords}
                    metric="weight"
                    title="Weight Progress"
                    color="#8b5cf6"
                    unit="kg"
                  />
                  <HealthChart
                    records={recentRecords}
                    metric="sleepDuration"
                    title="Sleep Duration"
                    color="#3b82f6"
                    unit="hours"
                  />
                  <HealthChart
                    records={recentRecords}
                    metric="moodLevel"
                    title="Mood Tracking"
                    color="#f59e0b"
                    unit="/10"
                  />
                </div>
              </div>
            )}

            {/* Recent Health Records */}
            {recentRecords.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Recent Health History
                </h2>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Heart Rate
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            BP
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Steps
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Weight
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Sleep
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mood
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {recentRecords.map((record) => (
                          <tr
                            key={record.timestamp}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(record.date).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric" }
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {record.heartRate} bpm
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {record.systolicBP}/{record.diastolicBP}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {parseInt(record.steps).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {record.weight} kg
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {record.sleepDuration}h
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex items-center gap-1">
                                <span>{record.moodLevel}/10</span>
                                <div className="flex">
                                  {Array.from(
                                    {
                                      length: Math.min(
                                        parseInt(record.moodLevel),
                                        5
                                      ),
                                    },
                                    (_, i) => (
                                      <span
                                        key={i}
                                        className="text-yellow-400 text-xs"
                                      >
                                        ★
                                      </span>
                                    )
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            {recentRecords.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <button
                    onClick={() => router.push("/healthinputs")}
                    className="bg-linear-to-br from-sky-50 to-blue-50 border border-sky-200 rounded-xl p-6 text-left hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center group-hover:bg-sky-200 transition-colors">
                        <Plus className="w-5 h-5 text-sky-600" />
                      </div>
                      <h3 className="font-semibold text-sky-900">
                        Add Health Data
                      </h3>
                    </div>
                    <p className="text-sm text-sky-700">
                      Submit today&apos;s health metrics
                    </p>
                  </button>

                  <button
                    onClick={() => router.push("/dashboard/chatbot")}
                    className="bg-linear-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 text-left hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <Brain className="w-5 h-5 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-green-900">
                        Health Assistant
                      </h3>
                    </div>
                    <p className="text-sm text-green-700">
                      Get AI-powered health insights
                    </p>
                  </button>

                  <button
                    className="bg-linear-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-6 text-left hover:shadow-md transition-all group cursor-pointer"
                    onClick={() => {
                      // Scroll to trends section
                      document
                        .querySelector(".health-trends")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-purple-900">
                        View Trends
                      </h3>
                    </div>
                    <p className="text-sm text-purple-700">
                      Analyze your health patterns
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* No Data State */}
            {!todayRecord && recentRecords.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Health Data Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start tracking your health by submitting your first daily
                  metrics.
                </p>
                <button
                  onClick={() => router.push("/healthinputs")}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Get Started
                </button>
              </div>
            )}
          </div>
        </main>
      </section>
    </div>
  );
};

export default Dashboard;
