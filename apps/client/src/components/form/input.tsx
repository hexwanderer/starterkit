import { useId } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useFieldContext } from "@/main";

export function InputWithLabel({ label }: { label: string }) {
  const field = useFieldContext<string>();
  const randomId = useId();

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={randomId}>{label}</Label>
      <Input
        id={randomId}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {field.state.meta.errors.length > 0 && (
        <em className="text-destructive text-sm">
          {field.state.meta.errors.map((err) => err.message).join(", ")}
        </em>
      )}
    </div>
  );
}
