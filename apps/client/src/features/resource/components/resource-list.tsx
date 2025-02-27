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
import { Badge } from "@/components/ui/badge";
import { Title } from "@/components/header";

export function ResourceList({ team }: { team?: string }) {
  const trpc = useTRPC();
  const session = authClient.useSession();
  const organization = authClient.useActiveOrganization();

  const resourceListQuery = useQuery(
    trpc.resource.getAll.queryOptions(
      {
        userId: session.data?.user.id ?? "",
        filter: {
          organizationId: organization.data?.id,
          teamSlug: team || undefined,
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
        accessorKey: "id",
        header: "ID",
        maxSize: 250,
      },
      {
        accessorKey: "title",
        header: "Title",
        size: 500,
      },
      {
        header: "Tags",
        cell: ({ row }) => {
          return (
            <div className="flex flex-wrap gap-2">
              {row.original.tags.map((tag) => (
                <Badge key={tag.id}>{tag.name}</Badge>
              ))}
            </div>
          );
        },
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
      <Title>Resources</Title>
      <Select
        value={team}
        onValueChange={(value) =>
          navigate({
            to: "/resources",
            search: {
              team: value,
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
                  <SelectItem key={team.slug} value={team.slug}>
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
