import { DataTableDemo } from "@/test";

function Clients() {
    return (
        <div className='p-8'>
        <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
              <p className="text-muted-foreground">
                Here&apos;s a list of your tasks for this month!
              </p>
        <DataTableDemo />
      </div>
    );
  }
  
  export default Clients;