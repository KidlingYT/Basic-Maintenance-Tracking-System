"use client";
import React, { useState, useEffect } from 'react';
import { Equipment } from '@/app/interfaces/equipment';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';

type Status = 'Operational' | 'Down' | 'Maintenance' | 'Retired';

const EquipmentPieChart = () => {
    const [pieData, setPieData] = useState<{ name: string; value: number }[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const STATUS_COLORS: Record<Status, string> = {
        Operational: '#22c55e',
        Down: '#ef4444',
        Maintenance: '#f59e0b',
        Retired: '#64748b',
    };

    useEffect(() => {
        // fetch data from the api
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/equipment');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const result: Equipment[] = await response.json();

                const statusCounts: Record<Status, number> = {
                    Operational: 0,
                    Down: 0,
                    Maintenance: 0,
                    Retired: 0,
                };

                result.forEach((item) => {
                    statusCounts[item.status]++;
                });

                const formattedData = Object.entries(statusCounts).map(([name, value]) => ({
                    name,
                    value,
                }));

                setPieData(formattedData);
            } catch (error) {
                console.error('Error fetching equipment data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div>
                <div
                    className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
                    role="status"
                    aria-label="loading"
                >
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <PieChart width={700} height={700}>
            <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={250}
                style={{ cursor: 'pointer', outline: 'none' }}
            >
                {pieData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={STATUS_COLORS[entry.name as Status]} />
                ))}
            </Pie>
            <Tooltip />
        </PieChart>
    );
};

export default EquipmentPieChart;