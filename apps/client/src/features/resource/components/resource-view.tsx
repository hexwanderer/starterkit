import { useResourceQueries } from "../api/queries";
import { useQuery } from "@tanstack/react-query";

export interface ResourceViewProps {
  id: string;
}

export function ResourceView({ id }: ResourceViewProps) {
  const resourceQuery = useQuery(useResourceQueries().getById(id));

  return (
    <div>
      {resourceQuery.data?.title}
      {resourceQuery.data?.description}
      {resourceQuery.data?.tags.map((tag) => tag.name)}
    </div>
  );
}
