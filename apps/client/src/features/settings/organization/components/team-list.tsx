import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { authClient, useTRPC } from "@/main";
import type { TeamGet } from "@repo/types";
import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export function TeamList() {
  const trpc = useTRPC();
  const teamsQuery = useQuery(trpc.team.getAll.queryOptions());

  const columns = useMemo<ColumnDef<TeamGet>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        size: 500,
      },
      {
        accessorKey: "slug",
        header: "Slug",
        size: 500,
      },
      {
        accessorKey: "visibility",
        header: "Visibility",
        size: 500,
        cell: ({ row }) => <Badge>{row.original.visibility}</Badge>,
        enableGlobalFilter: false,
      },
    ],
    [],
  );

  // biome-ignore lint/suspicious/noExplicitAny: per documentation
  const [globalFilter, setGlobalFilter] = useState<any>([]);

  const table = useReactTable({
    data: teamsQuery.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  const organization = authClient.useActiveOrganization();

  return (
    <>
      <div className="flex items-center gap-2">
        <Input
          className="flex-[4]"
          value={(table.getState().globalFilter as string) ?? ""}
          onChange={(event) =>
            table.setGlobalFilter(String(event.target.value))
          }
          placeholder="Search teams.."
        />
        <Link
          to="/organizations/$organizationId/teams/create"
          params={{ organizationId: organization.data?.id ?? "undefined" }}
        >
          <Button className="flex-[1]">Create Team</Button>
        </Link>
      </div>
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
          {teamsQuery.isLoading ? (
            Array.from({ length: 10 }).map((_, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <TableRow key={index}>
                {columns.map((column, cellIndex) => (
                  <TableCell
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    key={cellIndex}
                    style={{
                      minWidth: column.minSize,
                      width: column.size,
                      maxWidth: column.maxSize,
                    }}
                  >
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
                  <TableCell
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}
                  >
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
