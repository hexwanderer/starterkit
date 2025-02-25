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
import { authClient, useTRPC } from "@/main";
import type { ResourceGet } from "@repo/types";
import { useNavigate } from "@tanstack/react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ResourceList({ teamId }: { teamId?: string }) {
  const trpc = useTRPC();
  const organization = authClient.useActiveOrganization();

  const resourceListQuery = useQuery(
    trpc.resource.getAll.queryOptions(
      {
        filter: {
          organizationId: organization.data?.id,
          teamId: teamId || undefined,
        },
      },
      {
        enabled: !!organization.data?.id,
      },
    ),
  );

  const teamsQuery = useQuery(
    trpc.team.getAll.queryOptions(
      {
        filter: {
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          organizationId: organization.data?.id!,
        },
      },
      {
        enabled: !!organization.data?.id,
      },
    ),
  );

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

  const navigate = useNavigate();

  return (
    <>
      <h1>Resources</h1>
      <Select
        value={teamId}
        onValueChange={(value) =>
          navigate({
            to: "/resources",
            search: {
              teamId: value,
            },
          })
        }
      >
        {teamsQuery.isLoading ? (
          <SelectTrigger className="w-full" disabled>
            <SelectValue placeholder="Select team" />
          </SelectTrigger>
        ) : (
          <>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select team" />
            </SelectTrigger>
            <SelectContent>
              {teamsQuery.isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  <SelectItem key={index} value="Loading...">
                    <Skeleton />
                  </SelectItem>
                ))
              ) : teamsQuery.data?.length ? (
                teamsQuery.data.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="No teams found">No teams found</SelectItem>
              )}
            </SelectContent>
          </>
        )}
      </Select>
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
