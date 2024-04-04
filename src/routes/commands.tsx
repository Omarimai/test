import { DataTableDemoCommand } from "@/commandsComponent";

function Commands() {
    return (
      <div className='p-8'>
      <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your Commands for this month!
            </p>
      <DataTableDemoCommand />
    </div>
    );
  }
  
  export default Commands;