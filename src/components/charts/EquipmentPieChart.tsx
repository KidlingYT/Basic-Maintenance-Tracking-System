"use client";
import React from 'react';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';

const EquipmentPieChart = () => {

    const data = [
        { name: 'Geeksforgeeks', students: 400 },
        { name: 'Technical scripter', students: 700 },
        { name: 'Geek-i-knack', students: 200 },
        { name: 'Geek-o-mania', students: 1000 }
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <PieChart width={700} height={700}>
            <Pie
                data={data}
                dataKey="students"
                outerRadius={250}
                fill="green"
                style={{ cursor: 'pointer', outline: 'none' }} // Ensure no outline on focus
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip />
        </PieChart>
    );
}

export default EquipmentPieChart;