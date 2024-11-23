"use client";
import React, { useState, useEffect } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { MaintenanceRecord } from "@/app/interfaces/maintenance_record";
import { Equipment } from "@/app/interfaces/equipment";

export function MaintenanceTable() {
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<MaintenanceRecord[]>([]);
  const [equipmentData, setEquipmentData] = useState<Equipment[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState(""); 
  const [priorityFilter, setPriorityFilter] = useState(""); 
  const [completionFilter, setCompletionFilter] = useState(""); 
  const [grouping, setGrouping] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Fetch data from the API
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      
      try {
        setIsLoading(true);
        const response = await fetch("/api/maintenance");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        if (isMounted === true) {
          setData(result);
        }
        const response2 = await fetch("/api/equipment");
        if (!response2.ok) {
          throw new Error("Failed to fetch data");
        }
        const result2 = await response2.json();
        if (isMounted === true) {
          setEquipmentData(result2);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted === true) {
          setIsLoading(false);
        }
        
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter the data based on the dropdown selections and date range
  const filteredData = React.useMemo(() => {
    return data.filter((record) => {
      const matchesType = typeFilter ? record.type === typeFilter : true;
      const matchesPriority = priorityFilter ? record.priority === priorityFilter : true;
      const matchesCompletion = completionFilter
        ? record.completionStatus === completionFilter
        : true;

      // Date range filtering logic
      const recordDate = new Date(record.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      const matchesDateRange = (start ? recordDate >= start : true) && (end ? recordDate <= end : true);

      return matchesType && matchesPriority && matchesCompletion && matchesDateRange;
    });
  }, [data, typeFilter, priorityFilter, completionFilter, startDate, endDate]);

  // Define columns
  const columns = React.useMemo<ColumnDef<MaintenanceRecord>[]>(() => [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "equipmentId", header: "Equipment ID" },
    { accessorKey: "equipmentName", header: "Equipment Name" },
    { accessorKey: "date", header: "Date" },
    { accessorKey: "type", header: "Type" },
    { accessorKey: "hoursSpent", header: "Hours Spent" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "partsReplaced", header: "Parts Replaced" },
    { accessorKey: "priority", header: "Priority" },
    { accessorKey: "completionStatus", header: "Completion Status" },
  ], []);

  // Initialize the table
  const table = useReactTable({
    data: filteredData, // Use filtered data
    columns,
    state: {
      sorting,
      globalFilter,
      grouping, // Pass the grouping state
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onGroupingChange: setGrouping, // Set the function to handle grouping changes
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getGroupedRowModel: getGroupedRowModel(), // Enable row grouping
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
          className="p-2 border rounded w-full text-gray-900"
        />
      </div>

      {/* Filters for Type, Priority, Completion Status, and Date Range */}
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

      {/* Date Range Filter */}
      <div className="flex space-x-4 text-gray-900">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border rounded"
        />
        <span>to</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      {/* Grouping Toggle */}
      <div>
        <button
          onClick={() => setGrouping(grouping.length ? [] : ["equipmentId"])}  // Toggle grouping by equipmentId
          className="p-2 border rounded bg-blue-500 text-white"
        >
          {grouping.length ? "Ungroup by Equipment" : "Group by Equipment"}
        </button>
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
          <React.Fragment key={row.id}>
            {row.getIsGrouped() ? (
              <tr
                key={row.id}
                className="divide-x divide-blue-200 p-2 bg-slate-500 cursor-pointer"
                onClick={row.getToggleExpandedHandler()}
              >
                <td colSpan={row.getVisibleCells().length} className="p-2 text-bold">
                  {row.getIsExpanded() ? "Collapse" : "Expand"} Group:{" "}
                  {String(row.getAllCells().find((cell) => cell.column.id === 'equipmentId')?.getValue())}
                </td>
              </tr>
            ) : (
              <tr className="divide-x divide-blue-200 p-2 bg-slate-500">
                {row.getVisibleCells().map((cell) => {
                  const equipmentIdCell = cell.column.id === 'equipmentId';
                  const equipmentName = equipmentData.find((equipment) => equipment.id === row.original.equipmentId)?.name;  // Fix the lookup

                  return (
                    <td key={cell.id} className="p-2">
                      {cell.column.id === 'equipmentName' ? (equipmentName || 'N/A') : flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
      </table>
    </div>
  );
}
