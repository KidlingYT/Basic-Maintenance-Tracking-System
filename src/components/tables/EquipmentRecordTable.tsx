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
  const [editedData, setEditedData] = useState<Record<string, any>>({});
  const [editingRow, setEditingRow] = useState<string | null>(null);

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

  // Handle edit change for status field
  const handleEditChange = (id: string, value: string) => {
    setEditedData((prev) => ({
      ...prev,
      [id]: { ...prev[id], status: value },
    }));
  };

  const handleSave = async (id: string) => {
    const updatedRecord = { id, ...editedData[id] };

    try {
      const response = await fetch('/api/equipment', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRecord),
      });

      if (!response.ok) {
        throw new Error('Failed to update record');
      }

      // Update the table data
      setData((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...editedData[id] } : item))
      );

      // Reset editing state
      setEditingRow(null);
      setEditedData((prev) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    } catch (error) {
      console.error('Error updating record:', error);
    }
  };

  // Define columns (only status is editable)
  const columns = React.useMemo<ColumnDef<Equipment>[]>(() => [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Equipment Name" },
    { accessorKey: "location", header: "Location" },
    { accessorKey: "department", header: "Department" },
    { accessorKey: "model", header: "Model" },
    { accessorKey: "serialNumber", header: "Serial Number" },
    { accessorKey: "installDate", header: "Install Date" },
    { 
      accessorKey: "status", 
      header: "Status",
      cell: (info) => info.getValue(), // Define custom cell rendering for status
    },
  ], []);

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
          {table.getRowModel().rows.map((row) => {
            const isEditing = row.original.id === editingRow;

            return (
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
                {row.getVisibleCells().map((cell) => {
                  const cellValue = cell.getValue();
                  const accessorKey = cell.column.id;

                  return (
                    <td key={cell.id} className="p-2">
                      {accessorKey === "status" && isEditing ? (
                        <select
                          value={editedData[row.original.id]?.status || cellValue}
                          onChange={(e) =>
                            handleEditChange(row.original.id, e.target.value)
                          }
                          className="p-2 w-full text-gray-900"
                        >
                          <option value="Operational">Operational</option>
                          <option value="Down">Down</option>
                          <option value="Maintenance">Maintenance</option>
                          <option value="Retired">Retired</option>
                        </select>
                      ) : (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      )}
                    </td>
                  );
                })}

                {/* Action Buttons */}
                <td>
                  {isEditing ? (
                    <button
                      onClick={() => handleSave(row.original.id)}
                      className="px-2 py-1 bg-blue-500 text-white rounded"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditingRow(row.original.id)}
                      className="px-2 py-1 bg-gray-500 text-white rounded"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
