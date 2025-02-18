import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface SettingsCardProps {
  title: string;
  children: React.ReactNode;
}

export function SettingsCard({ title, children }: SettingsCardProps) {
  return (
    <Card className="flex-grow w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
