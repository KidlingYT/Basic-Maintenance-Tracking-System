"use client";
import React from "react";

const RecentMaintenance = () => {
    // Sample data
    const data = [
        { name: "Geeksforgeeks", students: 400 },
        { name: "Technical Scripter", students: 700 },
        { name: "Geek-i-knack", students: 200 },
        { name: "Geek-o-mania", students: 1000 },
    ];

    return (
        <div className="space-y-4 p-4">
            {data.map((activity, index) => (
                <div
                    key={index}
                    className="flex justify-between items-center p-4 border rounded-lg shadow-sm bg-gray-50"
                >
                    <span className="font-semibold text-lg">{activity.name}</span>
                    <span className="text-gray-600">{activity.students} students</span>
                </div>
            ))}
        </div>
    );
};

export default RecentMaintenance;
