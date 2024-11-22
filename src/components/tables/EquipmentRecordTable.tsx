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
import { Equipment } from "@/app/interfaces/equipment";

export function EquipmentRecordTable() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Equipment[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/equipment");
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

  // Filter the data based on dropdown selections and search input
  const filteredData = React.useMemo(() => {
    return data.filter((item) => {
      const matchesDepartment = departmentFilter
        ? item.department === departmentFilter
        : true;
      const matchesStatus = statusFilter ? item.status === statusFilter : true;
      const matchesGlobalFilter = globalFilter
        ? Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(globalFilter.toLowerCase())
        : true;
      return matchesDepartment && matchesStatus && matchesGlobalFilter;
    });
  }, [data, departmentFilter, statusFilter, globalFilter]);

  // Define columns
  const columns = React.useMemo<ColumnDef<Equipment>[]>(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "name", header: "Equipment Name" },
      { accessorKey: "location", header: "Location" },
      { accessorKey: "department", header: "Department" },
      { accessorKey: "model", header: "Model" },
      { accessorKey: "serialNumber", header: "Serial Number" },
      { accessorKey: "installDate", header: "Install Date" },
      { accessorKey: "status", header: "Status" },
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
    getFilteredRowModel: getFilteredRowModel()
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
      <input
        type="text"
        placeholder="Search all fields..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="p-2 border rounded w-full"
      />

      {/* Filters */}
      <div className="flex space-x-4">
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="p-2 border rounded text-gray-900"
        >
          <option value="">All Departments</option>
          <option value="Machining">Machining</option>
          <option value="Assembly">Assembly</option>
          <option value="Packaging">Packaging</option>
          <option value="Shipping">Shipping</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded text-gray-900"
        >
          <option value="">All Statuses</option>
          <option value="Operational">Operational</option>
          <option value="Down">Down</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Retired">Retired</option>
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
            <tr
              key={row.id}
              className={`divide-x divide-blue-200 p-2 ${
                row.original.status === "Down"
                  ? "bg-red-500 text-white"
                  : row.original.status === "Maintenance"
                  ? "bg-yellow-500 text-black"
                  : row.original.status === "Operational"
                  ? "bg-green-500 text-white"
                  : "bg-slate-500 text-white"
              }`}
            >
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
