"use client";
import dynamic from "next/dynamic";
const MaintenanceBarGraph = dynamic(
  () => import("@/components/charts/MaintenanceBarGraph"), 
  { ssr: false, 
    loading: () => (
      <div className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500" role="status" aria-label="loading">
        <span className="sr-only">Loading...</span>
      </div>
    ) 
  }
);

const EquipmentPieChart = dynamic(
  () => import("@/components/charts/EquipmentPieChart"), 
  { ssr: false, 
    loading: () => (
      <div className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500" role="status" aria-label="loading">
        <span className="sr-only">Loading...</span>
      </div>
    ) 
  }
);

const RecentMaintenance = dynamic(
  () => import("@/components/RecentMaintenance"), 
  { ssr: false, 
    loading: () => (
      <div className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500" role="status" aria-label="loading">
        <span className="sr-only">Loading...</span>
      </div>
    ) 
  }
);

import SideBarLinks from "@/components/SideBarLinks";

export default function Home() {
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] flex flex-row bg-slate-800">
      <div className="flex-initial w-2/12 flex flex-col bg-slate-300">
        <h1 className='text-black text-center p-4 text-xl'>Dashboard</h1>
        <SideBarLinks page={'dashboard'}/>
      </div>
      <main className="flex-shrink w-10/12 flex flex-row gap-8 row-start-2 items-center justify-center">
        <EquipmentPieChart/>
        <MaintenanceBarGraph/>
        <RecentMaintenance/>
      </main>
    </div>
  );
}
