import { useId } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useFieldContext } from "@/main";

export function PasswordWithLabel({ label }: { label: string }) {
  const field = useFieldContext<string>();
  const randomId = useId();

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={randomId}>{label}</Label>
      <Input
        type="password"
        id={randomId}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
    </div>
  );
}
