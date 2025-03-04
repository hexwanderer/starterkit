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
    <form.Subscribe
      selector={(state) => ({
        isSubmitting: state.isSubmitting,
        isValid: state.isValid,
        errorMap: state.errorMap,
      })}
    >
      {({ isSubmitting, isValid, errorMap }) => (
        <>
          <Button
            type="submit"
            form={formId}
            className={cn("w-full", className)}
            disabled={isSubmitting || !isValid || disabled}
          >
            {label}
          </Button>
          {errorMap && Object.keys(errorMap).length > 0 && (
            <div className="flex flex-col gap-2">
              {Object.values(errorMap).map((err, index) => {
                if (
                  typeof err === "object" &&
                  err !== null &&
                  "path" in err &&
                  "message" in err
                ) {
                  return (
                    <p
                      key={(err as { path: string }).path || index}
                      className="text-destructive text-sm"
                    >
                      {(err as { message: string }).message}
                    </p>
                  );
                }
                return null; // Skip invalid error entries
              })}
            </div>
          )}
        </>
      )}
    </form.Subscribe>
  );
}
