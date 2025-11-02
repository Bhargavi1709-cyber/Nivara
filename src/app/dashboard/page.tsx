"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, logout } from "@/lib/auth";
import {
  needsHealthSubmission,
  getLastSubmissionDate,
  getTimeUntilNextSubmission,
} from "@/lib/healthData";
import Button from "@/components/ui/Button";

interface HealthData {
  // Vitals
  heartRate: number; // BPM
  systolicBP: number; // mmHg
  diastolicBP: number; // mmHg

  // Activity
  steps: number;
  activeMinutes: number;

  // Sleep
  sleepDuration: number; // hours (e.g., 7.5)
  sleepQuality: "Excellent" | "Good" | "Fair" | "Poor";

  // Calories & Nutrition
  caloriesBurned: number;
  caloriesConsumed: number;
  waterIntake: number; // Liters

  // Weight & Body
  weight: number; // kg or lbs

  // Mood
  moodLevel: number; // 1 (worst) to 10 (best)
  stressLevel: number; // 1 (low) to 10 (high)

  // Symptoms (Boolean status)
  headache: boolean;
  fatigue: boolean;
  lossOfAppetite: boolean;
  bodyPain: boolean;
  dizziness: boolean;

  timestamp: string; // ISO Date String
}

// Mock data generator
const generateMockData = (): HealthData => ({
  heartRate: Math.floor(Math.random() * 40) + 60, // 60-100 BPM
  systolicBP: Math.floor(Math.random() * 40) + 110, // 110-150 mmHg
  diastolicBP: Math.floor(Math.random() * 30) + 70, // 70-100 mmHg
  steps: Math.floor(Math.random() * 5000) + 6000, // 6000-11000 steps
  activeMinutes: Math.floor(Math.random() * 60) + 30, // 30-90 minutes
  sleepDuration: Math.round((Math.random() * 3 + 6) * 10) / 10, // 6.0-9.0 hours
  sleepQuality: ["Excellent", "Good", "Fair", "Poor"][
    Math.floor(Math.random() * 4)
  ] as HealthData["sleepQuality"],
  caloriesBurned: Math.floor(Math.random() * 800) + 1800, // 1800-2600
  caloriesConsumed: Math.floor(Math.random() * 600) + 1600, // 1600-2200
  waterIntake: Math.round((Math.random() * 2 + 1.5) * 10) / 10, // 1.5-3.5 L
  weight: Math.round((Math.random() * 30 + 60) * 10) / 10, // 60-90 kg
  moodLevel: Math.floor(Math.random() * 10) + 1, // 1-10
  stressLevel: Math.floor(Math.random() * 10) + 1, // 1-10
  headache: Math.random() > 0.7,
  fatigue: Math.random() > 0.6,
  lossOfAppetite: Math.random() > 0.8,
  bodyPain: Math.random() > 0.75,
  dizziness: Math.random() > 0.85,
  timestamp: new Date().toISOString(),
});

// Helper component for circular progress
const CircularProgress = ({
  percentage,
  size = 120,
  strokeWidth = 8,
  color = "sky-500",
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

  return (
    <div className="relative inline-block">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          className={`text-${color} transition-all duration-500 ease-in-out`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-gray-700">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};

// Helper component for horizontal progress bar
const ProgressBar = ({
  value,
  max,
  label,
  color = "bg-sky-500",
}: {
  value: number;
  max: number;
  label: string;
  color?: string;
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
        <span>{label}</span>
        <span>
          {value}/{max}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all duration-500 ease-in-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

// Helper component for radial gauge
const RadialGauge = ({
  value,
  max,
  label,
  color = "text-sky-500",
}: {
  value: number;
  max: number;
  label: string;
  color?: string;
}) => {
  const percentage = (value / max) * 100;

  return (
    <div className="text-center">
      <div className="relative inline-block mb-2">
        <svg width="80" height="80" className="transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r="30"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx="40"
            cy="40"
            r="30"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={`${(percentage / 100) * 188.5} 188.5`}
            className={`${color} transition-all duration-500 ease-in-out`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-700">{value}</span>
        </div>
      </div>
      <p className="text-sm font-medium text-gray-600">{label}</p>
    </div>
  );
};

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<{
    id: string;
    fullName: string;
    email: string;
    createdAt: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsSubmission, setNeedsSubmission] = useState(false);
  const [_lastSubmission, setLastSubmission] = useState<Date | null>(null);
  const [_timeUntilNext, setTimeUntilNext] = useState({ hours: 0, minutes: 0 });
  const [healthData, setHealthData] = useState<HealthData>(generateMockData());

  useEffect(() => {
    const loadDashboard = () => {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        router.push("/login");
        return;
      }

      const needsData = needsHealthSubmission(currentUser.id);
      const lastSub = getLastSubmissionDate(currentUser.id);
      const timeNext = getTimeUntilNextSubmission();

      setUser(currentUser);
      setNeedsSubmission(needsData);
      setLastSubmission(lastSub);
      setTimeUntilNext(timeNext);
      setIsLoading(false);
    };

    loadDashboard();
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const simulateNewData = () => {
    setHealthData(generateMockData());
  };

  // Always show loading initially to prevent hydration mismatch
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const stepsGoal = 10000;
  const activeMinutesGoal = 60;
  const waterGoal = 3.0;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Personal Health Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Welcome back, {user.fullName}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="primary"
                size="sm"
                onClick={simulateNewData}
                className="bg-sky-500 hover:bg-sky-600"
              >
                Simulate New Data
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Health Data Reminders (if needed) */}
      {needsSubmission && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-orange-500 rounded-lg shadow-lg p-4 text-white mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⏰</span>
                <div>
                  <h3 className="font-bold">Time to Log Your Health Data!</h3>
                  <p className="text-sm opacity-90">
                    Submit your daily health metrics
                  </p>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.push("/healthinputs")}
                className="bg-white text-orange-600 hover:bg-gray-100"
              >
                Submit Now
              </Button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vitals Summary Card - Top Right */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Vitals Summary
            </h3>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-sky-500 mb-1">
                  {healthData.heartRate}
                </div>
                <div className="text-sm text-gray-600">BPM</div>
                <div className="text-xs text-gray-500">Heart Rate</div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Blood Pressure
                  </span>
                  <span className="text-lg font-semibold text-gray-800">
                    {healthData.systolicBP}/{healthData.diastolicBP}
                  </span>
                </div>
                <div className="text-xs text-gray-500 text-right">mmHg</div>
              </div>
            </div>
          </div>

          {/* Activity & Goals Progress Card - Mid-Left */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Activity & Goals
            </h3>
            <div className="space-y-4">
              <div className="text-center">
                <CircularProgress
                  percentage={(healthData.steps / stepsGoal) * 100}
                  size={100}
                />
                <div className="mt-2">
                  <div className="text-xl font-bold text-sky-500">
                    {healthData.steps.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Steps</div>
                </div>
              </div>
              <ProgressBar
                value={healthData.activeMinutes}
                max={activeMinutesGoal}
                label="Active Minutes"
                color="bg-sky-500"
              />
            </div>
          </div>

          {/* Sleep Quality & Duration Card - Mid-Center */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Sleep</h3>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-sky-500 mb-1">
                  {healthData.sleepDuration}
                </div>
                <div className="text-sm text-gray-600 mb-3">Hours</div>
                <div
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    healthData.sleepQuality === "Excellent"
                      ? "bg-green-100 text-green-800"
                      : healthData.sleepQuality === "Good"
                        ? "bg-blue-100 text-blue-800"
                        : healthData.sleepQuality === "Fair"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                  }`}
                >
                  {healthData.sleepQuality}
                </div>
              </div>
            </div>
          </div>

          {/* Nutrition Overview Card - Mid-Right */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Nutrition
            </h3>
            <div className="space-y-3">
              <ProgressBar
                value={healthData.caloriesBurned}
                max={2500}
                label="Calories Burned"
                color="bg-red-500"
              />
              <ProgressBar
                value={healthData.caloriesConsumed}
                max={2200}
                label="Calories Consumed"
                color="bg-orange-500"
              />
              <ProgressBar
                value={healthData.waterIntake}
                max={waterGoal}
                label="Water Intake (L)"
                color="bg-sky-500"
              />
            </div>
          </div>

          {/* Mood & Stress Gauge Card - Bottom-Left */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Mood & Stress
            </h3>
            <div className="flex justify-around">
              <RadialGauge
                value={healthData.moodLevel}
                max={10}
                label="Mood Level"
                color="text-sky-500"
              />
              <RadialGauge
                value={healthData.stressLevel}
                max={10}
                label="Stress Level"
                color="text-red-500"
              />
            </div>
          </div>

          {/* Symptom Tracker Card - Bottom-Right */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Symptom Tracker
            </h3>
            <div className="space-y-3">
              {[
                { key: "headache", label: "Headache" },
                { key: "fatigue", label: "Fatigue" },
                { key: "lossOfAppetite", label: "Loss of Appetite" },
                { key: "bodyPain", label: "Body Pain" },
                { key: "dizziness", label: "Dizziness" },
              ].map((symptom) => (
                <div
                  key={symptom.key}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {symptom.label}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      healthData[symptom.key as keyof HealthData]
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {healthData[symptom.key as keyof HealthData] ? "✗" : "✓"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Last updated: {new Date(healthData.timestamp).toLocaleString()}
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
