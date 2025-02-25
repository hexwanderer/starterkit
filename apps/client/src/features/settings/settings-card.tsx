import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface SettingsCardProps {
  title: string;
  children: React.ReactNode;
  variant?: "default" | "destructive";
}

export function SettingsCard({ title, children, variant }: SettingsCardProps) {
  return (
    <Card
      className={cn(
        "flex-grow w-full",
        variant === "destructive" ? "border-red-500" : "border-border",
      )}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
