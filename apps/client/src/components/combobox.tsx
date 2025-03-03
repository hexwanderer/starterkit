import * as React from "react";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

// Type definitions for Combobox
type SingleValue = string | undefined;
type MultiValue = string[] | undefined;

type ComboboxMode = "single" | "multiple";

// Generic type parameters to handle both modes
type ComboboxValueType<M extends ComboboxMode> = M extends "single"
  ? SingleValue
  : MultiValue;

type ComboboxChangeHandler<M extends ComboboxMode> = (
  value: ComboboxValueType<M>,
) => void;

export interface ComboboxProps<M extends ComboboxMode> {
  mode: M;
  value: ComboboxValueType<M>;
  onValueChange: ComboboxChangeHandler<M>;
  children: React.ReactNode;
  placeholder?: string;
  className?: string;
  maxSelected?: number; // Only relevant for multiple mode
  name?: string; // For form integration
  clearable?: boolean; // Allow clearing the selection
}

interface ComboboxOptionProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
}

interface ComboboxContextProps<M extends ComboboxMode> {
  mode: M;
  value: ComboboxValueType<M>;
  onValueChange: ComboboxChangeHandler<M>;
  close: () => void;
  maxSelected?: number;
  inputValue: string;
  setInputValue: (val: string) => void;
  clearable?: boolean;
}

// Create context with undefined as initial value
const ComboboxContext = React.createContext<
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  ComboboxContextProps<any> | undefined
>(undefined);

// Type guard to check if a child is a valid ComboboxOption
function isComboboxOption(
  child: React.ReactNode,
): child is React.ReactElement<ComboboxOptionProps> {
  return (
    React.isValidElement(child) &&
    "value" in child.props &&
    typeof child.props.value === "string"
  );
}

export function Combobox<M extends ComboboxMode>({
  mode,
  value,
  onValueChange,
  children,
  placeholder = mode === "single" ? "Select an option..." : "Select options...",
  className,
  maxSelected = Number.POSITIVE_INFINITY,
  name,
  clearable = false,
}: ComboboxProps<M>) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  // Generate a hidden input for form integration
  const hiddenInput = name ? (
    <input
      type="hidden"
      name={name}
      value={
        mode === "single"
          ? (value as string) || ""
          : (value as string[]).join(",")
      }
    />
  ) : null;

  // Get labels for selected values
  const selectedLabels = React.useMemo(() => {
    if (mode === "single") {
      if (value === undefined) return [];
      const label = getLabelFromChildren(children, value as string);
      return label ? [label] : [];
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else {
      return getLabelsFromChildren(children, value as string[]);
    }
  }, [children, value, mode]);

  // Close the popover
  const handleClose = () => setOpen(false);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mode === "single") {
      (onValueChange as (val: string | undefined) => void)(undefined);
    } else {
      (onValueChange as (val: string[]) => void)([]);
    }
  };

  return (
    <ComboboxContext.Provider
      value={{
        mode,
        value:
          mode === "single"
            ? (value as SingleValue)
            : ((Array.isArray(value) ? value : []) as MultiValue),
        onValueChange,
        close: handleClose,
        maxSelected,
        inputValue,
        setInputValue,
        clearable,
      }}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              className,
            )}
            aria-label="Open combobox"
            onClick={() => setOpen(!open)}
          >
            <div className="line-clamp-1 text-left">
              {selectedLabels.length > 0
                ? selectedLabels.join(", ")
                : placeholder}
            </div>
            <div className="flex items-center gap-1">
              {clearable && selectedLabels.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-full p-1 hover:bg-muted focus:outline-none focus:ring-1 focus:ring-ring"
                  aria-label="Clear selection"
                >
                  {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 opacity-50"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              )}
              <ChevronsUpDown className="h-4 w-4 opacity-50" />
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search..."
              value={inputValue}
              onValueChange={(e) => setInputValue(e)}
            />
            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup>{children}</CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {hiddenInput}
    </ComboboxContext.Provider>
  );
}

export function ComboboxOption({
  value,
  children,
  disabled,
}: ComboboxOptionProps) {
  const ctx = React.useContext(ComboboxContext);

  if (!ctx) {
    throw new Error("ComboboxOption must be used within Combobox");
  }

  const { mode } = ctx;

  // Handle different modes
  let selected: boolean;
  let isAtMaxSelection = false;

  if (mode === "single") {
    selected = ctx.value === value;
  } else {
    const multiValue = ctx.value as string[];
    selected = multiValue.includes(value);
    isAtMaxSelection =
      !!ctx.maxSelected &&
      !selected &&
      multiValue.length >= (ctx.maxSelected ?? 0);
  }

  const isDisabled = (disabled || isAtMaxSelection) ?? false;

  // Filter options based on inputValue
  const matchesInput = ctx.inputValue
    ? children?.toString().toLowerCase().includes(ctx.inputValue.toLowerCase())
    : true;

  if (!matchesInput) return null;

  const handleSelect = () => {
    if (isDisabled) return;

    if (mode === "single") {
      // Toggle selection for single mode if same value is selected and clearable is true
      if (ctx.clearable && selected) {
        (ctx.onValueChange as (val: string | undefined) => void)(undefined);
      } else {
        (ctx.onValueChange as (val: string | undefined) => void)(value);
      }
      ctx.close();
    } else {
      const multiValue = ctx.value as string[];
      if (selected) {
        (ctx.onValueChange as (val: string[]) => void)(
          multiValue.filter((v) => v !== value),
        );
      } else {
        (ctx.onValueChange as (val: string[]) => void)([...multiValue, value]);
      }
    }
  };

  return (
    <CommandItem
      onSelect={handleSelect}
      className={cn(isDisabled && "opacity-50 cursor-not-allowed")}
      disabled={isDisabled}
    >
      <Check
        className={cn("mr-2 h-4 w-4", selected ? "opacity-100" : "opacity-0")}
      />
      <span>{children}</span>
    </CommandItem>
  );
}

// Helper functions
function getLabelFromChildren(
  children: React.ReactNode,
  val: string,
): string | undefined {
  const arr = React.Children.toArray(children);
  for (const child of arr) {
    if (isComboboxOption(child) && child.props.value === val) {
      return child.props.children?.toString();
    }
  }
  return undefined;
}

function getLabelsFromChildren(
  children: React.ReactNode,
  vals: string[] = [],
): string[] {
  const arr = React.Children.toArray(children);
  const labels: string[] = [];
  for (const child of arr) {
    if (isComboboxOption(child) && vals.includes(child.props.value)) {
      labels.push(child.props.children?.toString() ?? "");
    }
  }
  return labels;
}
