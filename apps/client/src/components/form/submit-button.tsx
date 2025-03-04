import { useFormContext } from "@/main";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export function SubmitButton({
  label,
  formId,
  className,
  disabled,
}: {
  label: string;
  formId?: string;
  className?: string;
  disabled?: boolean;
}) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => [state.isSubmitting, state.isValid]}>
      {([isSubmitting, isValid]) => (
        <Button
          type="submit"
          form={formId}
          className={cn("w-full", className)}
          disabled={isSubmitting || !isValid || disabled}
        >
          {label}
        </Button>
      )}
    </form.Subscribe>
  );
}
