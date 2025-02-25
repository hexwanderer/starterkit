import { useTRPC } from "@/main";
import { useQuery } from "@tanstack/react-query";

export interface ResourceViewProps {
  id: string;
}

export function ResourceView({ id }: ResourceViewProps) {
  const trpc = useTRPC();
  const resourceQuery = useQuery(trpc.resource.getById.queryOptions({ id }));

  return (
    <div>
      {resourceQuery.data?.title}
      {resourceQuery.data?.description}
      {resourceQuery.data?.tags.map((tag) => tag.name)}
    </div>
  );
}
