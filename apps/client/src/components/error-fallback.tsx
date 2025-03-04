import type React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExternalLink, Home, RefreshCw } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

// Update the interface to match Sentry's error data structure
interface ErrorFallbackProps {
  error: unknown;
  componentStack?: string;
  eventId?: string;
  resetError: () => void;
}

export const ErrorFallback = ({
  error,
  componentStack,
  resetError,
  eventId,
}: ErrorFallbackProps): React.ReactElement => {
  // Determine if we're in development mode
  const isDevelopment = process.env.NODE_ENV === "development";

  const navigate = useNavigate();

  // Cast the unknown error to Error if possible, or create a fallback
  const errorObject = error instanceof Error ? error : new Error(String(error));

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl flex items-center gap-2 text-destructive">
            {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Something went wrong
          </CardTitle>
          <CardDescription>
            {isDevelopment
              ? "We've encountered an error in development mode"
              : "We've encountered an unexpected error"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {isDevelopment ? (
            <>
              <Alert variant="destructive" className="mb-4">
                <AlertTitle className="font-mono font-bold">
                  {errorObject.name}
                </AlertTitle>
                <AlertDescription className="mt-2">
                  {errorObject.message}
                </AlertDescription>
              </Alert>
              {componentStack && (
                <div className="mt-4 bg-muted p-4 rounded-md overflow-auto max-h-60 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent hover:scrollbar-thumb-gray-500">
                  <h3 className="font-medium mb-2">Component Stack</h3>
                  <pre className="font-mono text-xs whitespace-pre-wrap text-muted-foreground">
                    {componentStack}
                  </pre>
                </div>
              )}
            </>
          ) : (
            <div className="py-6 text-center">
              <p className="text-muted-foreground mb-6">
                We apologize for the inconvenience. The application has
                encountered an unexpected error.
              </p>
              <div className="rounded-md border p-4 bg-muted/40 mb-4">
                <h3 className="font-medium mb-2">What happened?</h3>
                <p className="text-sm text-muted-foreground">
                  Our team has been notified of this issue and we're working to
                  resolve it as quickly as possible.
                  {eventId && (
                    <span className="block mt-2 text-xs">
                      Error reference: {eventId}
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 border-t pt-4">
          <Button
            variant="default"
            className="w-full sm:w-auto"
            onClick={resetError}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => navigate({ to: "/dashboard" })}
          >
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
