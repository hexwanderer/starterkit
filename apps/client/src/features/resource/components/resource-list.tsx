import { useQuery } from "@tanstack/react-query";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useTRPC } from "@/main";
import type { ResourceGet } from "@repo/types";

export function ResourceList() {
  const trpc = useTRPC();
  const resourceListQuery = useQuery(trpc.resource.getAll.queryOptions());

  const columns = useMemo<ColumnDef<ResourceGet>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Title",
      },
      {
        accessorKey: "tags",
        header: "Tags",
      },
    ],
    [],
  );

  const table = useReactTable({
    data: resourceListQuery.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <h1>Resources</h1>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {resourceListQuery.isLoading ? (
            Array.from({ length: 10 }).map((_, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <TableRow key={index}>
                {columns.map((_column, cellIndex) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  <TableCell key={cellIndex}>
                    <Skeleton
                      className={
                        cellIndex === 0
                          ? "h-4 w-4"
                          : // Checkbox
                            cellIndex === columns.length - 1
                            ? "h-8 w-8"
                            : // Actions
                              "h-8 w-32" // Data cells
                      }
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? "selected" : ""}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length}>No results found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
