import SideBarLinks from "@/components/SideBarLinks";

export default function Maintenance() {
    return (
        <div className="min-h-screen font-[family-name:var(--font-geist-sans)] flex flex-row bg-slate-800">
          <div className="flex-initial w-2/12 flex flex-col bg-slate-300">
            <h1 className='text-black text-center p-4 text-xl'>Maintenance</h1>
            <SideBarLinks/>
          </div>
          <main className="flex-shrink w-9/12 flex flex-col gap-8 row-start-2 items-center sm:items-start ">
          </main>
          <footer className="row-start-3 w-1/12 flex gap-6 flex-wrap items-center justify-center">
          </footer>
        </div>
    );
}