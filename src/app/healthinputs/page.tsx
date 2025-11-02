"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormField from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import { getCurrentUser } from "@/lib/auth";
import {
  saveHealthRecord,
  hasSubmittedToday,
  getTodayHealthRecord,
} from "@/lib/healthData";

interface HealthData {
  // Vitals
  heartRate: string;
  systolicBP: string;
  diastolicBP: string;

  // Activity
  steps: string;
  activeMinutes: string;

  // Sleep
  sleepDuration: string;
  sleepQuality: string;

  // Calories & Nutrition
  caloriesBurned: string;
  caloriesConsumed: string;
  waterIntake: string;

  // Weight & Body
  weight: string;

  // Mood
  moodLevel: string;
  stressLevel: string;

  // Symptoms (Yes/No checkboxes)
  headache: boolean;
  fatigue: boolean;
  lossOfAppetite: boolean;
  bodyPain: boolean;
  dizziness: boolean;

  timestamp: string;
}

const HealthInputsPage = () => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [user, setUser] = useState<{
    id: string;
    fullName: string;
    email: string;
  } | null>(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [isResubmitting, setIsResubmitting] = useState(false);

  const [formData, setFormData] = useState<HealthData>({
    heartRate: "",
    systolicBP: "",
    diastolicBP: "",
    steps: "",
    activeMinutes: "",
    sleepDuration: "",
    sleepQuality: "",
    caloriesBurned: "",
    caloriesConsumed: "",
    waterIntake: "",
    weight: "",
    moodLevel: "",
    stressLevel: "",
    headache: false,
    fatigue: false,
    lossOfAppetite: false,
    bodyPain: false,
    dizziness: false,
    timestamp: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    // Check if user is authenticated and load data
    const loadUserData = () => {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        router.push("/login");
        return;
      }

      // Check URL parameters to see if this is a resubmission
      const urlParams = new URLSearchParams(window.location.search);
      const resubmit = urlParams.get("resubmit") === "true";

      // Check if already submitted today
      const hasSubmitted = hasSubmittedToday(currentUser.id);

      // If resubmitting, allow form editing even if already submitted
      if (resubmit) {
        setIsResubmitting(true);
        // Load existing data for editing
        const todayRecord = getTodayHealthRecord(currentUser.id);
        if (todayRecord) {
          setFormData(todayRecord);
        }
        setAlreadySubmitted(false); // Allow form to be shown
      } else if (hasSubmitted) {
        // Normal flow - show read-only view if already submitted
        const todayRecord = getTodayHealthRecord(currentUser.id);
        if (todayRecord) {
          setFormData(todayRecord);
          setAlreadySubmitted(true);
        }
      }

      setUser(currentUser);
      setIsChecking(false);
    };

    loadUserData();
  }, [router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      router.push("/login");
      return;
    }

    setIsLoading(true);

    try {
      // Save health record with user ID
      // Create data object without timestamp (saveHealthRecord generates it automatically)
      const dataToSave = {
        heartRate: formData.heartRate,
        systolicBP: formData.systolicBP,
        diastolicBP: formData.diastolicBP,
        steps: formData.steps,
        activeMinutes: formData.activeMinutes,
        sleepDuration: formData.sleepDuration,
        sleepQuality: formData.sleepQuality,
        caloriesBurned: formData.caloriesBurned,
        caloriesConsumed: formData.caloriesConsumed,
        waterIntake: formData.waterIntake,
        weight: formData.weight,
        moodLevel: formData.moodLevel,
        stressLevel: formData.stressLevel,
        headache: formData.headache,
        fatigue: formData.fatigue,
        lossOfAppetite: formData.lossOfAppetite,
        bodyPain: formData.bodyPain,
        dizziness: formData.dizziness,
        userId: user.id,
      };

      saveHealthRecord(dataToSave);

      const successMessage = isResubmitting
        ? "Health data updated successfully! ✓ Redirecting to dashboard..."
        : "Health data saved successfully! ✓ Redirecting to dashboard...";

      setSaveMessage(successMessage);

      // Redirect to dashboard after 1.5 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error) {
      setSaveMessage("Error saving data. Please try again.");
      console.error("Error saving health data:", error);
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (alreadySubmitted && !isResubmitting) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Already Submitted Today
              </h1>
              <p className="text-gray-600 mb-4">
                You&apos;ve already submitted your health data for today. You
                can submit again tomorrow at 6:00 AM.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => {
                    const url = new URL(window.location.href);
                    url.searchParams.set("resubmit", "true");
                    window.location.href = url.toString();
                  }}
                >
                  Update Today&apos;s Data
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => router.push("/dashboard")}
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>

            <div className="border-t pt-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Today&apos;s Submitted Data
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-gray-600 font-medium">Heart Rate</p>
                  <p className="text-lg font-semibold">
                    {formData.heartRate} bpm
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-gray-600 font-medium">BP</p>
                  <p className="text-lg font-semibold">
                    {formData.systolicBP}/{formData.diastolicBP}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-gray-600 font-medium">Steps</p>
                  <p className="text-lg font-semibold">{formData.steps}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-gray-600 font-medium">Weight</p>
                  <p className="text-lg font-semibold">{formData.weight} kg</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-gray-600 font-medium">Sleep</p>
                  <p className="text-lg font-semibold">
                    {formData.sleepDuration} hrs
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-gray-600 font-medium">Water Intake</p>
                  <p className="text-lg font-semibold">
                    {formData.waterIntake} L
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isResubmitting ? "Update Health Data" : "Health Inputs"}
          </h1>
          <p className="text-gray-600 mb-4">
            {isResubmitting
              ? "Update your health metrics and vitals for today"
              : "Track your daily health metrics and vitals"}
          </p>

          {isResubmitting && (
            <div className="bg-blue-100 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-blue-600 font-medium">
                  📝 Update Mode:
                </span>
                <span className="text-blue-800">
                  You&apos;re updating your existing health data for today.
                  Changes will overwrite previous values.
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Vitals Section */}
            <section className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">🫀</span> Vitals
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Heart Rate (bpm) *"
                  name="heartRate"
                  type="number"
                  value={formData.heartRate}
                  onChange={handleInputChange}
                  placeholder="e.g., 72"
                  helperText="Normal: 60-100 bpm"
                  required
                />
                <FormField
                  label="Systolic BP (mmHg) *"
                  name="systolicBP"
                  type="number"
                  value={formData.systolicBP}
                  onChange={handleInputChange}
                  placeholder="e.g., 120"
                  helperText="Top number"
                  required
                />
                <FormField
                  label="Diastolic BP (mmHg) *"
                  name="diastolicBP"
                  type="number"
                  value={formData.diastolicBP}
                  onChange={handleInputChange}
                  placeholder="e.g., 80"
                  helperText="Bottom number"
                  required
                />
              </div>
            </section>

            {/* Activity Section */}
            <section className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">🏃‍♂️</span> Activity
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Steps *"
                  name="steps"
                  type="number"
                  value={formData.steps}
                  onChange={handleInputChange}
                  placeholder="e.g., 7500"
                  helperText="Steps per day"
                  required
                />
                <FormField
                  label="Active Minutes *"
                  name="activeMinutes"
                  type="number"
                  value={formData.activeMinutes}
                  onChange={handleInputChange}
                  placeholder="e.g., 45"
                  helperText="Active time today"
                  required
                />
              </div>
            </section>

            {/* Sleep Section */}
            <section className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">😴</span> Sleep
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Sleep Duration (hours) *"
                  name="sleepDuration"
                  type="number"
                  step="0.1"
                  value={formData.sleepDuration}
                  onChange={handleInputChange}
                  placeholder="e.g., 6.5"
                  helperText="Hours of sleep"
                  required
                />
                <FormField
                  label="Sleep Quality (%) *"
                  name="sleepQuality"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.sleepQuality}
                  onChange={handleInputChange}
                  placeholder="e.g., 80"
                  helperText="Sleep score (0-100)"
                  required
                />
              </div>
            </section>

            {/* Nutrition & Calories Section */}
            <section className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">🔥</span> Nutrition & Calories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  label="Calories Burned (kcal) *"
                  name="caloriesBurned"
                  type="number"
                  value={formData.caloriesBurned}
                  onChange={handleInputChange}
                  placeholder="e.g., 2200"
                  helperText="Total calories burned"
                  required
                />
                <FormField
                  label="Calories Consumed (kcal) *"
                  name="caloriesConsumed"
                  type="number"
                  value={formData.caloriesConsumed}
                  onChange={handleInputChange}
                  placeholder="e.g., 1800"
                  helperText="Total calories eaten"
                  required
                />
                <FormField
                  label="Water Intake (L) *"
                  name="waterIntake"
                  type="number"
                  step="0.1"
                  value={formData.waterIntake}
                  onChange={handleInputChange}
                  placeholder="e.g., 2.0"
                  helperText="Liters per day"
                  required
                />
              </div>
            </section>

            {/* Body Metrics Section */}
            <section className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">⚖️</span> Body Metrics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Weight (kg) *"
                  name="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="e.g., 65"
                  helperText="Daily weight measurement"
                  required
                />
              </div>
            </section>

            {/* Mood & Mental State Section */}
            <section className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">🧠</span> Mood & Mental State
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Mood Level (1-10) *"
                  name="moodLevel"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.moodLevel}
                  onChange={handleInputChange}
                  placeholder="1-10"
                  helperText="1 = Very low, 10 = Very high"
                  required
                />
                <FormField
                  label="Stress Level (1-10) *"
                  name="stressLevel"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.stressLevel}
                  onChange={handleInputChange}
                  placeholder="1-10"
                  helperText="1 = No stress, 10 = Very stressed"
                  required
                />
              </div>
            </section>

            {/* Symptoms Section */}
            <section className="pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">�</span> Symptoms
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Check any symptoms you are experiencing today
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition">
                  <input
                    type="checkbox"
                    name="headache"
                    checked={formData.headache}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    required={false}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Headache
                  </span>
                </label>

                <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition">
                  <input
                    type="checkbox"
                    name="fatigue"
                    checked={formData.fatigue}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    required={false}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Fatigue
                  </span>
                </label>

                <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition">
                  <input
                    type="checkbox"
                    name="lossOfAppetite"
                    checked={formData.lossOfAppetite}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    required={false}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Loss of Appetite
                  </span>
                </label>

                <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition">
                  <input
                    type="checkbox"
                    name="bodyPain"
                    checked={formData.bodyPain}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    required={false}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Body Pain
                  </span>
                </label>

                <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition">
                  <input
                    type="checkbox"
                    name="dizziness"
                    checked={formData.dizziness}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    required={false}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Dizziness
                  </span>
                </label>
              </div>
            </section>

            {/* Success Message */}
            {saveMessage && (
              <div
                className={`p-4 rounded-md ${
                  saveMessage.includes("successfully")
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {saveMessage}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              {isResubmitting && (
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={() => router.push("/dashboard")}
                  className="w-full"
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full"
              >
                {isResubmitting ? "Update Health Data" : "Save Health Data"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HealthInputsPage;
