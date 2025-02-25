import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";

export function Header() {
  const { title } = useTitle();
  return (
    <header className="flex h-16 w-full items-center border-b border-border/40 bg-background px-4 shadow-sm">
      <div className="flex items-center gap-1">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
        {title ? (
          <>
            <Separator orientation="vertical" className="h-6 opacity-30" />
            <h1 className="text-xl font-medium tracking-tight">{title}</h1>
          </>
        ) : (
          <Skeleton className="h-6 w-32" />
        )}
      </div>
      <div className="ml-auto flex items-center gap-4">
        {/* You can add actions, notifications, profile, etc. here */}
      </div>
    </header>
  );
}

interface TitleContextType {
  title?: string;
  setTitle: (title?: string) => void;
}

const TitleContext = createContext<TitleContextType | undefined>(undefined);

export function TitleProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState<string | undefined>(undefined);

  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  );
}

export function useTitle() {
  const context = useContext(TitleContext);
  if (context === undefined) {
    throw new Error("useTitle must be used within a TitleProvider");
  }
  return context;
}

export function Title({ children }: { children?: string }) {
  const { setTitle } = useTitle();

  useEffect(() => {
    setTitle(children);
    return () => setTitle(undefined); // Clean up on unmount
  }, [children, setTitle]);

  return null; // No UI, only updates context
}
