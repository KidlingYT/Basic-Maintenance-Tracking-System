"use client";
import React, { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Equipment } from '@/app/interfaces/equipment';

export function EquipmentRecordTable() {
  const [sorting, setSorting] = useState<SortingState>([]);

  // Sample data
  const data = React.useMemo<Equipment[]>(() => [
      { id: '1', name: 'Excavator', location: 'New York', department: 'Assembly', model: '4', serialNumber: '12er', installDate: new Date('11-21-11'), status: 'Down'},
      { id: '2', name: 'Excavator', location: 'New York', department: 'Assembly', model: '4', serialNumber: '12erf', installDate: new Date('1-11-11'), status: 'Maintenance'},
      { id: '3', name: 'Excavator', location: 'New York', department: 'Assembly', model: '4', serialNumber: '12ert', installDate: new Date('1-1-11'), status: 'Operational'},
      { id: '4', name: 'Excavator', location: 'New York', department: 'Assembly', model: '4', serialNumber: '12erg', installDate: new Date('11-1-11'), status: 'Retired'},
      { id: '5', name: 'Excavator', location: 'New York', department: 'Assembly', model: '4', serialNumber: '12erh', installDate: new Date('11-11-12'), status: 'Operational'},
      { id: '6', name: 'Excavator', location: 'New York', department: 'Assembly', model: '4', serialNumber: '12erj', installDate: new Date('11-11-14'), status: 'Operational'},
    ], []
  );

  // Define columns
  const columns = React.useMemo<ColumnDef<typeof data[0]>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
      },
      {
        accessorKey: 'name',
        header: 'Equipment Name',
      },
      {
        accessorKey: 'location',
        header: 'Location',
      },
      {
        accessorKey: 'department',
        header: 'Department',
      },
      {
        accessorKey: 'model',
        header: 'Model',
      },
      {
        accessorKey: 'serialNumber',
        header: 'Serial Number',
      },
      {
        accessorKey: 'installDate',
        header: 'Install Date',
      },
      {
        accessorKey: 'status',
        header: 'Status',
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <table className='border-solid border-white border-2'>
      <thead className='border-bottom border-blue border-2'>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className='divide-x divide-blue-200'>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                onClick={header.column.getToggleSortingHandler()}
                className='p-2 cursor-pointer bg-white text-black'
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
                {{
                  asc: ' 🔼',
                  desc: ' 🔽',
                }[header.column.getIsSorted() as string] ?? null}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className='divide-y divide-blue-200'>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className={`divide-x divide-blue-200 p-2 ${
            row.original.status === 'Down' 
              ? 'bg-red-500 text-white'
              : row.original.status === 'Maintenance'
              ? 'bg-yellow-500 text-black'
              : row.original.status === 'Operational'
              ? 'bg-green-500 text-white'
              : 'bg-slate-500 text-white'
          }`}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className='p-2'>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
