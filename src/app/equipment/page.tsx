"use client";
import SideBarLinks from "@/components/SideBarLinks";
import dynamic from "next/dynamic";
const EquipmentRecordTable = dynamic(
  () => import("@/components/tables/EquipmentRecordTable").then((mod) => mod.EquipmentRecordTable), 
  {
    loading: () => 
  <div>
    <div className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500" role="status" aria-label="loading">
      <span className="sr-only">Loading...</span>
    </div>
  </div>,
  }
);

export default function Equipment() {
    return (
        <div className="min-h-screen font-[family-name:var(--font-geist-sans)] flex flex-row bg-slate-800">
          <div className="flex-initial w-2/12 flex flex-col bg-slate-300">
            <h1 className='text-black text-center p-4 text-xl'>Equipment</h1>
            <SideBarLinks page={'equipment'}/>
          </div>
          <main className="flex-shrink w-9/12 flex flex-col gap-8 row-start-2 items-center justify-center ">
            <EquipmentRecordTable/>
          </main>
          <footer className="row-start-3 w-1/12 flex gap-6 flex-wrap items-center justify-center">
          </footer>
        </div>
    );
}