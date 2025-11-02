// Health data management utilities

export interface HealthRecord {
  heartRate: string;
  systolicBP: string;
  diastolicBP: string;
  steps: string;
  activeMinutes: string;
  sleepDuration: string;
  sleepQuality: string;
  caloriesBurned: string;
  caloriesConsumed: string;
  waterIntake: string;
  weight: string;
  moodLevel: string;
  stressLevel: string;
  headache: boolean;
  fatigue: boolean;
  lossOfAppetite: boolean;
  bodyPain: boolean;
  dizziness: boolean;
  timestamp: string;
  date: string; // Format: YYYY-MM-DD
  userId: string;
}

const HEALTH_RECORDS_KEY = "healthRecords";
const LAST_SUBMISSION_KEY = "lastHealthSubmission";

// Get user's health records
export const getHealthRecords = (userId: string): HealthRecord[] => {
  if (typeof window === "undefined") return [];

  try {
    const records = localStorage.getItem(HEALTH_RECORDS_KEY);
    if (!records) return [];

    const allRecords: HealthRecord[] = JSON.parse(records);
    return allRecords.filter((record) => record.userId === userId);
  } catch (error) {
    console.error("Error reading health records:", error);
    return [];
  }
};

// Save health record
export const saveHealthRecord = (
  record: Omit<HealthRecord, "date" | "timestamp"> & { userId: string }
): boolean => {
  if (typeof window === "undefined") return false;

  try {
    const timestamp = new Date().toISOString();
    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const newRecord: HealthRecord = {
      ...record,
      timestamp,
      date,
    };

    const existingRecords = localStorage.getItem(HEALTH_RECORDS_KEY);
    const records: HealthRecord[] = existingRecords
      ? JSON.parse(existingRecords)
      : [];

    // Check if there's already a record for today for this user
    const todayRecordIndex = records.findIndex(
      (r) => r.userId === record.userId && r.date === date
    );

    if (todayRecordIndex >= 0) {
      // Update existing record for today
      records[todayRecordIndex] = newRecord;
    } else {
      // Add new record
      records.push(newRecord);
    }

    localStorage.setItem(HEALTH_RECORDS_KEY, JSON.stringify(records));
    localStorage.setItem(`${LAST_SUBMISSION_KEY}_${record.userId}`, timestamp);
    return true;
  } catch (error) {
    console.error("Error saving health record:", error);
    return false;
  }
};

// Check if user has submitted health data today
export const hasSubmittedToday = (userId: string): boolean => {
  if (typeof window === "undefined") return false;

  try {
    const lastSubmission = localStorage.getItem(
      `${LAST_SUBMISSION_KEY}_${userId}`
    );
    if (!lastSubmission) return false;

    const lastDate = new Date(lastSubmission).toISOString().split("T")[0];
    const today = new Date().toISOString().split("T")[0];

    return lastDate === today;
  } catch (error) {
    console.error("Error checking submission status:", error);
    return false;
  }
};

export const needsHealthSubmission = (userId: string): boolean => {
  if (typeof window === "undefined") return false;

  const lastSubmission = localStorage.getItem(
    `${LAST_SUBMISSION_KEY}_${userId}`
  );

  if (!lastSubmission) return true;

  const lastSubmissionDate = new Date(lastSubmission);
  const now = new Date();

  // Get today's 6 AM
  const today6AM = new Date();
  today6AM.setHours(6, 0, 0, 0);

  // Get yesterday's 6 AM
  const yesterday6AM = new Date(today6AM);
  yesterday6AM.setDate(yesterday6AM.getDate() - 1);

  const cutoffTime = now < today6AM ? yesterday6AM : today6AM;

  return lastSubmissionDate < cutoffTime;
};

// Get last submission date
export const getLastSubmissionDate = (userId: string): Date | null => {
  if (typeof window === "undefined") return null;

  const lastSubmission = localStorage.getItem(
    `${LAST_SUBMISSION_KEY}_${userId}`
  );
  return lastSubmission ? new Date(lastSubmission) : null;
};

// Get time until next submission (6 AM)
export const getTimeUntilNextSubmission = (): {
  hours: number;
  minutes: number;
} => {
  const now = new Date();
  const next6AM = new Date();
  next6AM.setHours(6, 0, 0, 0);

  // If it's past 6 AM today, set to tomorrow's 6 AM
  if (now >= next6AM) {
    next6AM.setDate(next6AM.getDate() + 1);
  }

  const diff = next6AM.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { hours, minutes };
};

// Get today's health record
export const getTodayHealthRecord = (userId: string): HealthRecord | null => {
  const records = getHealthRecords(userId);
  const today = new Date().toISOString().split("T")[0];

  return records.find((record) => record.date === today) || null;
};

// Check if user is first time (never submitted health data)
export const isFirstTimeUser = (userId: string): boolean => {
  const records = getHealthRecords(userId);
  return records.length === 0;
};
