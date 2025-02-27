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
import { sortIcon } from "@/lib/react-utils";
import type { UseQueryResult } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

interface QueryResult {
  users: Member[];
}

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface MemberManagementProps {
  query: UseQueryResult<QueryResult, unknown>;
  addMemberParams: {
    organizationSlug: string;
    teamSlug?: string;
  };
}

export function MemberManagement({
  query,
  addMemberParams,
}: MemberManagementProps) {
  const columns = useMemo<ColumnDef<Member>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            className="p-0"
            variant="ghost"
            onClick={() => column.toggleSorting()}
          >
            <span>Name</span>
            {sortIcon(column.getIsSorted())}
          </Button>
        ),
        size: 800,
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <Button
            className="p-0"
            variant="ghost"
            onClick={() => column.toggleSorting()}
          >
            <span>Email</span>
            {sortIcon(column.getIsSorted())}
          </Button>
        ),
        size: 500,
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <Button
            className="p-0"
            variant="ghost"
            onClick={() => column.toggleSorting()}
          >
            <span>Role</span>
            {sortIcon(column.getIsSorted())}
          </Button>
        ),
        cell: ({ row }) => <Badge>{row.original.role}</Badge>,
        size: 300,
      },
    ],
    [],
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  // biome-ignore lint/suspicious/noExplicitAny: per documentation
  const [globalFilter, setGlobalFilter] = useState<any>([]);

  const table = useReactTable({
    data: query.data?.users ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
  });

  return (
    <>
      <div className="flex items-center gap-2">
        <Input
          className="flex-[4]"
          value={(table.getState().globalFilter as string) ?? ""}
          onChange={(event) =>
            table.setGlobalFilter(String(event.target.value))
          }
          placeholder="Search members..."
        />
        <Link
          to={
            addMemberParams.teamSlug
              ? "/organizations/$organizationSlug/teams/$teamSlug/invite"
              : "/organizations/$organizationSlug/invite"
          }
          params={{
            ...(addMemberParams.teamSlug
              ? {
                  teamSlug: addMemberParams.teamSlug,
                  organizationSlug: addMemberParams.organizationSlug,
                }
              : {
                  organizationSlug: addMemberParams.organizationSlug,
                }),
          }}
        >
          <Button className="flex-[1]">Add Member</Button>
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
          {query.isLoading ? (
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
