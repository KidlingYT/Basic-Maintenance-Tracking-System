"use client";
import { MaintenanceRecord } from "@/app/interfaces/maintenance_record";
import React, { useState, useEffect } from "react";

const RecentMaintenance = () => {
    // Sample data
  const [data, setData] = useState<MaintenanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null); // Reset error state
        const response = await fetch("/api/maintenance");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result: MaintenanceRecord[] = await response.json();
        // Sort the records by date
        const sortedRecords = result.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        // The four most recent records
        const recentRecords: MaintenanceRecord[] = sortedRecords.slice(0, 4);
        setData(recentRecords);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div
          className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-600 rounded-full"
          role="status"
          aria-label="loading"
        ></div>
      </div>
    );
  }

    return (
    <div className="space-y-4 p-4">
        {data.map((record) => (
            <div
            key={record.id}
            className="flex flex-col space-y-2 p-4 border rounded-lg shadow-sm bg-gray-50"
            >
            <div className="flex justify-between">
                <span className="font-bold text-lg text-gray-900">{record.type} Maintenance</span>
                <span className="text-sm text-gray-600">{new Date(record.date).toLocaleDateString()}</span>
            </div>
            <div className="text-gray-800">
                <span className="font-medium">Technician:</span> {record.technician}
            </div>
            <div className="text-gray-800">
                <span className="font-medium">Hours Spent:</span> {record.hoursSpent}
            </div>
            <div className="text-gray-800">
                <span className="font-medium">Description:</span> {record.description}
            </div>
            <div className="text-gray-800">
                <span className="font-medium">Priority:</span> {record.priority}
            </div>
            <div className={`text-sm ${record.completionStatus === "Complete" ? "text-green-500" : "text-yellow-500"}`}>
                {record.completionStatus}
            </div>
            </div>
        ))}
    </div>
    );
};

export default RecentMaintenance;
