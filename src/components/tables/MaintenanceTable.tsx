"use client";
import React, { useState, useEffect } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { MaintenanceRecord } from "@/app/interfaces/maintenance_record";

export function MaintenanceTable() {
  const [isLoading, setIsLoading] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<MaintenanceRecord[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState(""); 
  const [priorityFilter, setPriorityFilter] = useState(""); 
  const [completionFilter, setCompletionFilter] = useState(""); 

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/maintenance");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter the data based on the dropdown selections
  const filteredData = React.useMemo(() => {
    return data.filter((record) => {
      const matchesType = typeFilter ? record.type === typeFilter : true;
      const matchesPriority = priorityFilter ? record.priority === priorityFilter : true;
      const matchesCompletion = completionFilter
        ? record.completionStatus === completionFilter
        : true;
      return matchesType && matchesPriority && matchesCompletion;
    });
  }, [data, typeFilter, priorityFilter, completionFilter]);

  // Define columns
  const columns = React.useMemo<ColumnDef<MaintenanceRecord>[]>(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "equipmentId", header: "Equipment ID" },
      { accessorKey: "date", header: "Date" },
      { accessorKey: "type", header: "Type" },
      { accessorKey: "hoursSpent", header: "Hours Spent" },
      { accessorKey: "description", header: "Description" },
      { accessorKey: "partsReplaced", header: "Parts Replaced" },
      { accessorKey: "priority", header: "Priority" },
      { accessorKey: "completionStatus", header: "Completion Status" },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData, // Use filtered data
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

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
    <div className="p-4 space-y-4">
      {/* Global Search */}
      <div>
        <input
          type="text"
          placeholder="Search all columns..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      {/* Filters for Type, Priority, and Completion Status */}
      <div className="flex space-x-4">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="p-2 border rounded text-gray-900"
        >
          <option value="">All Types</option>
          <option value="Preventive">Preventive</option>
          <option value="Repair">Repair</option>
          <option value="Emergency">Emergency</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="p-2 border rounded text-gray-900"
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select
          value={completionFilter}
          onChange={(e) => setCompletionFilter(e.target.value)}
          className="p-2 border rounded text-gray-900"
        >
          <option value="">All Completion Statuses</option>
          <option value="Complete">Complete</option>
          <option value="Incomplete">Incomplete</option>
          <option value="Pending Parts">Pending Parts</option>
        </select>
      </div>

      {/* Table */}
      <table className="border-solid border-white border-2 w-full">
        <thead className="border-b border-blue border-2">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="divide-x divide-blue-200">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="p-2 cursor-pointer bg-white text-black"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted() as string] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-blue-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="divide-x divide-blue-200 p-2 bg-slate-500">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
