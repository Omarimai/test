"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { axiosInstance } from "./axios"
import { CalendarIcon, PlusCircle } from "lucide-react"
import { Dialog, DialogTrigger } from "./components/ui/dialog"
import { Client } from "./clientsComponent"
import { Popover, PopoverContent, PopoverTrigger } from "./components/ui/popover"
import { cn } from "./lib/utils"
import { format } from "date-fns"
import { Calendar } from "./components/ui/calendar"

interface Command {
  commandId: number;
  dateCommande: string; // Assuming you will convert the Date to a string for serialization
  montant: number;
  client: Client; // Assuming Command is another interface representing the Command entity
}



export function DataTableDemoCommand() {
  const [data, setData] = React.useState<Command[]>([]);

  const onDeleteCommande = (commandId: number) => {
    axiosInstance.delete(`/api/commande/deletecommande/${commandId}`)
      .then(() => {
        setData((prevData) => prevData.filter((command) => command.commandId !== commandId));
        setRefreshFindAll(!refreshFindAll)
      })
      .catch((error) => console.error('Error deleting client:', error));
  };
  const columns: ColumnDef<Command>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "commandId",
      header: "Command ID",
      cell: ({ row }) => <div>{row.getValue("commandId")}</div>,
    },
    {
      accessorKey: "dateCommande",
      header: "Date de Commande",
      cell: ({ row }) => <div>{row.getValue("dateCommande")}</div>,
    },
    {
      accessorKey: "montant",
      header: "Montant",
      cell: ({ row }) => <div>{row.getValue("montant")}</div>,
    },
    {
      id: "client",
      header: "Client_id",
      cell: ({ row }) => {
        const client = row.original.client;
        return <div>{client.client_id}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const command = row.original;
        const handleDeleteCommande = () => {
          onDeleteCommande(command.commandId);
        };
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={handleDeleteCommande}>Delete Commande</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
              // onClick={()=>{setModifyState('update') ; setOpen(true) ; setUpdatedCommand(command!)}}

              >Update Commande</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const [refreshFindAll, setRefreshFindAll] = React.useState<boolean>(false)
  React.useEffect(() => {
    axiosInstance.get('/api/commande/commandes')
      .then((response) => setData(response.data))
      .catch((error) => console.error('Error fetching commands:', error));
  }, [refreshFindAll]);
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })
  interface NewCommand {
    dateCommande: Date; // Assuming you will convert the Date to a string for serialization
    montant: number;
    client: {
      client_id : number;
    }; // Assuming Command is another interface representing the Command entity
  }
  const [newCommand, setNewCommand] = React.useState<NewCommand>({
    dateCommande: new Date(),
    montant: 0,
    client: {
      client_id: 0
    }
  });
  const handleChange = (e) => {
    const { id, value } = e.target;
    setNewCommand((prev) => ({
      ...prev,
      [id]: value
    }));
  };


  const handleAddCommand = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission (e.g., send new client data to server)
    newCommand.dateCommande = date!
    axiosInstance.post(`/api/commande/add`, newCommand)
      .then(() => {
        setRefreshFindAll(!refreshFindAll)
      })
      .catch((error) => console.error('Error adding command:', error));
    setNewCommand({
      dateCommande: new Date(),
      montant: 0,
      client: {
        client_id: 0
      }
    });
    setOpen(false)
  };

  // const handleUpdatedCommandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { id, value } = e.target;
  //   setUpdatedCommand((prevClient: Command | undefined) => ({
  //     ...(prevClient || {}), // Ensure prevClient is not undefined
  //     [id]: value
  //   }));
  // };
  // const handleUpdateCommand = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   // Handle form submission (e.g., send new client data to server)
  //   axiosInstance.post(`/api/commande/update/${updatedCommand?.commandId}/${updatedCommand?.client.client_id}`,updatedCommand)
  //         .then(() => {
  //           setRefreshFindAll(!refreshFindAll)
  //         })
  //         .catch((error) => console.error('Error updating command:', error));
  //   setUpdatedCommand(updatedCommand);
  //   setOpen(false)
  // };
  const [date, setDate] = React.useState<Date>()

  const [open, setOpen] = React.useState(false);
  const [modifyState, setModifyState] = React.useState('add');
  // const [updatedCommand , setUpdatedCommand] = React.useState<Command>();

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by commandId..."
          value={(table.getColumn("commandId")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("commandId")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setModifyState('add')} className="m-4"><PlusCircle className="m-2" /></Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            {modifyState === 'add' && (
              <>
                <DialogHeader>
                  <DialogTitle>Add Command</DialogTitle>
                  <DialogDescription>Add new Command here. Click save when you're done.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddCommand}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="dateCommande" className="text-right">
                        Date de Commande
                      </Label>
                      {/* <Input id="dateCommande" value={newCommand.dateCommande} className="col-span-3" onChange={handleChange} /> */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            onChange={handleChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="montant" className="text-right">
                        Montant
                      </Label>
                      <Input id="montant" value={newCommand.montant} className="col-span-3" onChange={handleChange} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="client_id" className="text-right">
                        Client ID
                      </Label>
                      
                      <Input id="client_id" value={newCommand.client.client_id} className="col-span-3" onChange={handleChange} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </form>
              </>
            )}
            {/* {modifyState === 'update' && (
    <>
      <DialogHeader>
        <DialogTitle>Update Command</DialogTitle>
        <DialogDescription>Make changes to your Command here. Click save when you're done.</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleUpdateCommand}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="commandId" className="text-right">
              Command ID
            </Label>
            <Input readOnly id="commandId" value={updatedCommand?.commandId} className="col-span-3" onChange={handleUpdatedCommandChange} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dateCommande" className="text-right">
              Date de Commande
            </Label>
            <Input id="dateCommande" value={updatedCommand?.dateCommande} className="col-span-3" onChange={handleUpdatedCommandChange} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="montant" className="text-right">
              Montant
            </Label>
            <Input id="montant" value={updatedCommand?.montant} className="col-span-3" onChange={handleUpdatedCommandChange} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="client_id" className="text-right">
              Client ID
            </Label>
            <Input id="client_id" value={updatedCommand?.client_id} className="col-span-3" onChange={handleUpdatedCommandChange} />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </form>
    </>
  )} */}
          </DialogContent>

        </Dialog>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value: unknown) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
