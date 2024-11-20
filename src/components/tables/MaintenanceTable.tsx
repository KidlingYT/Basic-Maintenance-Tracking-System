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
import { MaintenanceRecord } from '@/app/interfaces/maintenance_record';

export function MaintenanceTable() {
  const [sorting, setSorting] = useState<SortingState>([]);

  // Sample data
  const data = React.useMemo<MaintenanceRecord[]>(() => [
      { id: '1', equipmentId: 'Excavator', date: new Date('11-12-19'), type: 'Emergency', technician: 'eli', hoursSpent: 12, description: 'wow', partsReplaced: [], priority: 'High', completionStatus: 'Complete'},
      { id: '1', equipmentId: 'Excavator', date: new Date('11-14-19'), type: 'Emergency', technician: 'eli', hoursSpent: 12, description: 'wow', partsReplaced: [], priority: 'High', completionStatus: 'Complete'},
      { id: '1', equipmentId: 'Excavator', date: new Date('11-12-19'), type: 'Emergency', technician: 'eli', hoursSpent: 12, description: 'wow', partsReplaced: [], priority: 'High', completionStatus: 'Complete'},
      { id: '1', equipmentId: 'Excavator', date: new Date('11-13-19'), type: 'Emergency', technician: 'eli', hoursSpent: 12, description: 'wow', partsReplaced: [], priority: 'High', completionStatus: 'Complete'},
      { id: '1', equipmentId: 'Excavator', date: new Date('11-12-20'), type: 'Emergency', technician: 'eli', hoursSpent: 12, description: 'wow', partsReplaced: [], priority: 'High', completionStatus: 'Complete'},
      { id: '1', equipmentId: 'Excavator', date: new Date('10-12-19'), type: 'Emergency', technician: 'eli', hoursSpent: 12, description: 'wow', partsReplaced: [], priority: 'High', completionStatus: 'Complete'},
      { id: '1', equipmentId: 'Excavator', date: new Date('12-12-19'), type: 'Emergency', technician: 'eli', hoursSpent: 12, description: 'wow', partsReplaced: [], priority: 'High', completionStatus: 'Complete'},
      { id: '1', equipmentId: 'Excavator', date: new Date('1-12-19'), type: 'Emergency', technician: 'eli', hoursSpent: 12, description: 'wow', partsReplaced: [], priority: 'High', completionStatus: 'Complete'},
      { id: '1', equipmentId: 'Excavator', date: new Date('11-12-1'), type: 'Emergency', technician: 'eli', hoursSpent: 12, description: 'wow', partsReplaced: [], priority: 'High', completionStatus: 'Complete'},
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
        accessorKey: 'equipmentId',
        header: 'Equipment ID',
      },
      {
        accessorKey: 'date',
        header: 'Date',
      },
      {
        accessorKey: 'type',
        header: 'Type',
      },
      {
        accessorKey: 'hoursSpent',
        header: 'Hours Spent',
      },
      {
        accessorKey: 'description',
        header: 'Description',
      },
      {
        accessorKey: 'partsReplaced',
        header: 'Parts Replaced',
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
      },
      {
        accessorKey: 'completionStatus',
        header: 'Completion Status',
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
          <tr key={row.id} className={`divide-x divide-blue-200 p-2`}>
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
