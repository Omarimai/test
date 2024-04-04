"use client"

import * as React from "react"
import {
  CaretSortIcon,
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
import { PlusCircle } from "lucide-react"
import { Dialog, DialogTrigger } from "./components/ui/dialog"

interface Client {
    client_id: number;
    nom: string;
    mail: string;
    adress: string;
}

// const data: Client[] = [
//     {
//         client_id: 1,
//         nom: "John Doe",
//         mail: "john.doe@example.com",
//         adress: "123 Main St",
//     },
//     {
//         client_id: 2,
//         nom: "Jane Smith",
//         mail: "jane.smith@example.com",
//         adress: "456 Elm St",
//     },
//     {
//         client_id: 3,
//         nom: "Alice Johnson",
//         mail: "alice.johnson@example.com",
//         adress: "789 Oak St",
//     },
// ];

// const handleDeleteClient = (idToDelete : number) => {
//     axiosInstance.delete(`/api/client/.delete/${id}`)
//     .then(() => fetchClients())
//     .catch((error) => console.error('Error deleting client:', error));
// }  



export function DataTableDemo() {
    const [data, setData] = React.useState<Client[]>([]);

    const onDeleteClient = (clientId : number) => {
        axiosInstance.delete(`/api/client/.delete/${clientId}`)
          .then(() => {
            setData((prevData) => prevData.filter((client) => client.client_id !== clientId));
            setRefreshFindAll(!refreshFindAll)
          })
          .catch((error) => console.error('Error deleting client:', error));
      };
    const columns: ColumnDef<Client>[] = [
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
          accessorKey: "nom",
          header: "Nom",
          cell: ({ row }) => (
            <div className="capitalize">{row.getValue("nom")}</div>
          ),
        },
        {
          accessorKey: "mail",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Email
                <CaretSortIcon className="ml-2 h-4 w-4" />
              </Button>
            )
          },
          cell: ({ row }) => <div className="lowercase">{row.getValue("mail")}</div>,
        },
        {
          accessorKey: "adress",
          header: "Address",
          cell: ({ row }) => <div className="capitalize">{row.getValue("adress")}</div>,
        },
        {
          id: "actions",
          enableHiding: false,
          cell: ({ row }) => {
            const client = row.original
            const handleDeleteClient = () => {
                onDeleteClient(client.client_id);
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
                  <DropdownMenuItem
                    // onClick={() => navigator.clipboard.writeText(client.client_id.toString())}
                    onClick={handleDeleteClient}
                  >
                   delete Client
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={()=>{setModifyState('update') ; setOpen(true) ; setUpdatedClient(client!)}}>update client</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )
          },
        },
      ]
const [refreshFindAll , setRefreshFindAll] = React.useState<boolean>(false)
React.useEffect(() => {
  axiosInstance.get('/api/client/findAll')
    .then((response) => setData(response.data))
    .catch((error) => console.error('Error fetching clients:', error));
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
  interface NewClient {
    nom: string;
    mail: string;
    adress: string;
  }
  const [newClient, setNewClient] = React.useState<NewClient>({
    nom: "",
    mail: "",
    adress: ""
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewClient((prevClient) => ({
      ...prevClient,
      [id]: value
    }));
  };
  
  const handleAddClient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission (e.g., send new client data to server)
    axiosInstance.post(`/api/client/add`,newClient)
          .then(() => {
            setRefreshFindAll(!refreshFindAll)
          })
          .catch((error) => console.error('Error adding user:', error));
    setNewClient({
      nom: "",
      mail: "",
      adress: ""
    });
    setOpen(false)
  };

  const handleUpdatedClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUpdatedClient((prevClient: Client | undefined) => ({
      ...(prevClient || {}), // Ensure prevClient is not undefined
      [id]: value
    }));
  };
  const handleUpdateClient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission (e.g., send new client data to server)
    axiosInstance.post(`/api/client/update/${updatedClient?.client_id}`,updatedClient)
          .then(() => {
            setRefreshFindAll(!refreshFindAll)
          })
          .catch((error) => console.error('Error updating user:', error));
    setUpdatedClient(updatedClient);
    setOpen(false)
  };
  
  const [open , setOpen] = React.useState(false);
  const [modifyState , setModifyState] = React.useState('add');
  const [updatedClient , setUpdatedClient] = React.useState<Client>();

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("mail")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("mail")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
      <Button onClick={()=>setModifyState('add')} className="m-4"><PlusCircle className="m-2"/></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
       {modifyState == 'add' && <><DialogHeader>
                          <DialogTitle>add Client</DialogTitle>
                          <DialogDescription>
                          add new client here. Click save when you're done.
                          </DialogDescription>
                      </DialogHeader><form onSubmit={handleAddClient}>
                              <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="nom" className="text-right">
                                          Name
                                      </Label>
                                      <Input id="nom" value={newClient.nom} className="col-span-3" onChange={handleChange} />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="mail" className="text-right">
                                          Email
                                      </Label>
                                      <Input id="mail" value={newClient.mail} className="col-span-3" onChange={handleChange} />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="adress" className="text-right">
                                          Address
                                      </Label>
                                      <Input id="adress" value={newClient.adress} className="col-span-3" onChange={handleChange} />
                                  </div>
                              </div>
                              <DialogFooter>
                                  <Button type="submit">Save changes</Button>
                              </DialogFooter>
                          </form></>}
      {modifyState == 'update' && <><DialogHeader>
                          <DialogTitle>update Client</DialogTitle>
                          <DialogDescription>
                          Make changes to your profile here. Click save when you're done.
                          </DialogDescription>
                      </DialogHeader><form onSubmit={handleUpdateClient}>
                              <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="nom" className="text-right">
                                          id
                                      </Label>
                                      <Input readOnly id="nom" value={updatedClient?.client_id} className="col-span-3" onChange={handleUpdatedClientChange} />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="nom" className="text-right">
                                          Name
                                      </Label>
                                      <Input id="nom" value={updatedClient?.nom} className="col-span-3" onChange={handleUpdatedClientChange} />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="mail" className="text-right">
                                          Email
                                      </Label>
                                      <Input id="mail" value={updatedClient?.mail} className="col-span-3" onChange={handleUpdatedClientChange} />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="adress" className="text-right">
                                          Address
                                      </Label>
                                      <Input id="adress" value={updatedClient?.adress} className="col-span-3" onChange={handleUpdatedClientChange} />
                                  </div>
                              </div>
                              <DialogFooter>
                                  <Button type="submit">Save changes</Button>
                              </DialogFooter>
                          </form></>}
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
