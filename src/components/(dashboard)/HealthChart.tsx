"use client";
import { useState } from "react";
import { HealthRecord } from "@/lib/healthData";

interface HealthChartProps {
  records: HealthRecord[];
  metric: "heartRate" | "steps" | "weight" | "sleepDuration" | "moodLevel";
  title: string;
  color: string;
  unit: string;
}

const HealthChart = ({
  records,
  metric,
  title,
  color,
  unit,
}: HealthChartProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<"7" | "30">("7");

  const filteredRecords = records.slice(-parseInt(selectedPeriod)).reverse();
  const values = filteredRecords.map(
    (record) => parseFloat(record[metric]) || 0
  );
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue || 1;

  const getBarHeight = (value: number) => {
    return ((value - minValue) / range) * 100;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setSelectedPeriod("7")}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              selectedPeriod === "7"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            7 days
          </button>
          <button
            onClick={() => setSelectedPeriod("30")}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              selectedPeriod === "30"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            30 days
          </button>
        </div>
      </div>

      {filteredRecords.length > 0 ? (
        <div className="space-y-4">
          {/* Current Value */}
          <div className="text-center">
            <div className="text-3xl font-bold" style={{ color }}>
              {values[0]?.toLocaleString() || 0}
            </div>
            <div className="text-sm text-gray-500">{unit}</div>
          </div>

          {/* Simple Bar Chart */}
          <div className="flex items-end justify-between h-32 gap-1">
            {filteredRecords.map((record, index) => (
              <div
                key={record.date}
                className="flex-1 flex flex-col items-center"
              >
                <div
                  className="w-full rounded-t-sm transition-all hover:opacity-75"
                  style={{
                    backgroundColor: color,
                    height: `${Math.max(getBarHeight(values[index]), 5)}%`,
                    minHeight: "4px",
                  }}
                />
                <div className="text-xs text-gray-400 mt-1 text-center">
                  {new Date(record.date).getDate()}
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex justify-between text-sm">
            <div className="text-center">
              <div className="font-semibold text-gray-900">{maxValue}</div>
              <div className="text-gray-500">Max</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">
                {(values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)}
              </div>
              <div className="text-gray-500">Avg</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">{minValue}</div>
              <div className="text-gray-500">Min</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <div className="text-sm">
            No data available for the selected period
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthChart;
