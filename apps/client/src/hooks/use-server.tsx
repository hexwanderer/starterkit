import type { treaty } from "@elysiajs/eden";
import type { App } from "@repo/server";
import type { ReactNode } from "@tanstack/react-router";
import { createContext, useContext } from "react";

type ServerClient = ReturnType<typeof treaty<App>>;

type ServerState = {
  serverClient: ServerClient;
};

const ServerContext = createContext<ServerState | null>(null);

export function useServer() {
  const context = useContext(ServerContext);
  if (!context) {
    throw new Error("useServer must be used within a ServerProvider.");
  }

  return context;
}

interface ServerStateProviderProps {
  serverClient: ServerClient;
  children: ReactNode;
}

export function ServerStateProvider({
  serverClient,
  children,
}: ServerStateProviderProps) {
  return (
    <ServerContext.Provider value={{ serverClient }}>
      {children}
    </ServerContext.Provider>
  );
}
