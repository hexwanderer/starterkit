import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { UseQueryResult } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useMemo } from "react";

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
}

export function MemberManagement({ query }: MemberManagementProps) {
  const columns = useMemo<ColumnDef<Member>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        size: 800,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 500,
      },
      {
        accessorKey: "role",
        header: "Role",
        size: 300,
      },
    ],
    [],
  );

  const table = useReactTable({
    data: query.data?.users ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
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
  );
}
