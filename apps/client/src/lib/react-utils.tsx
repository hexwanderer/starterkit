import type { SortDirection } from "@tanstack/react-table";
import { ChevronDown, ChevronUp } from "lucide-react";

export function sortIcon(isSorted: boolean | SortDirection) {
  switch (isSorted) {
    case false:
      return null;
    case "asc":
      return <ChevronUp className="h-2 w-2 stroke-gray-400" />;
    case "desc":
      return <ChevronDown className="h-2 w-2 stroke-gray-400" />;
  }
}
