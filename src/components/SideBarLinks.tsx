"use client";
import { useState } from 'react';
import Link from 'next/link';
import EquipmentForm from './forms/EquipmentForm';
import MaintenanceRecordForm from './forms/MaintenanceRecordForm';

export default function SideBarLinks() {
    const [isEquipmentFormVisible, setIsEquipmentFormVisible] = useState(false);
    const [isMaintenanceFormVisible, setIsMaintenanceFormVisible] = useState(false);

    return (
        <div className='flex-col flex'>
            <Link href='/' className="h-12 w-full align-center mt-32 bg-blue-900
            transition duration-150 ease-out hover:ease-in hover:bg-blue-100 hover:text-black cursor-pointer">
                <p className="text-center p-3">Dashboard</p>
            </Link>
            <Link href='/maintenance' className="h-12 w-full align-center bg-blue-900
            transition duration-150 ease-out hover:ease-in hover:bg-blue-100 hover:text-black cursor-pointer">
                <p className="text-center p-3">Maintenance</p>
            </Link>
            <Link href='/equipment' className="h-12 w-full align-center bg-blue-900
            transition duration-150 ease-out hover:ease-in hover:bg-blue-100 hover:text-black cursor-pointer">
                <p className="text-center p-3">Equipment</p>
            </Link>
            <div onClick={() => setIsEquipmentFormVisible(true)} className="h-12 w-full align-center bg-blue-900
            transition duration-150 ease-out hover:ease-in hover:bg-blue-100 hover:text-black cursor-pointer">
                <p className="text-center p-3">New Equipment Form ⇗</p>
            </div>
            <div onClick={() => setIsMaintenanceFormVisible(true)} className="h-12 w-full align-center bg-blue-900
            transition duration-150 ease-out hover:ease-in hover:bg-blue-100 hover:text-black cursor-pointer">
                <p className="text-center p-3">Maintenance Record Form ⇗</p>
            </div>
            {isEquipmentFormVisible && (
                <EquipmentForm onClose={() => setIsEquipmentFormVisible(false)} />
            )}
            {isMaintenanceFormVisible && (
                <MaintenanceRecordForm onClose={() => setIsMaintenanceFormVisible(false)} />
            )}
        </div>
    )
}