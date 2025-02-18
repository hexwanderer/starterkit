import { useQuery } from "@tanstack/react-query";
import { useResourceQueries } from "../api/queries";

export function ResourceList() {
  const resourceListQuery = useQuery(useResourceQueries().getAll);

  return (
    <div>
      {resourceListQuery.data?.data.map((resource) => (
        <div key={resource.id}>{resource.title}</div>
      ))}
    </div>
  );
}
