"use client";
import { MaintenanceRecord } from "@/app/interfaces/maintenance_record";
import React, { useState, useEffect } from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";

type Department = "Machining" | "Assembly" | "Packaging" | "Shipping";

const MaintenanceBarGraph = () => {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
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

        // Calculate hours by department
        const departmentCounts: Record<Department, number> = {
          Machining: 0,
          Assembly: 0,
          Packaging: 0,
          Shipping: 0,
        };

        // result.forEach((item) => { // Need to link to equipment data
        //     const department = item.department as Department; // Explicitly cast to Department
        //     departmentCounts[department] += item.hoursSpent;
        //   });

        const formattedData = Object.entries(departmentCounts).map(
          ([name, value]) => ({
            name,
            value,
          })
        );

        setData(formattedData);
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

  if (error) {
    return <div className="text-red-600 text-center">{error}</div>;
  }

  return (
    <BarChart width={600} height={400} data={data}>
      <Bar dataKey="value" fill="green" />
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="name" />
      <YAxis />
    </BarChart>
  );
};

export default MaintenanceBarGraph;